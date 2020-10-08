import {IArtifact} from './IArtifact'
import {BuildVersions} from '../../buildVersions/BuildVersions'
import {IArtifactsResolver, IArtifactsResolverBase} from '../../spec/base/IArtifacts'
import {IArtifactData} from '../../spec/buildVersions/IBuildVersions'
import {IArtifactPublishEvents} from '../../spec/repo/ICommon'
import semver from 'semver'

interface IResolverArtifact {
  name: string;
  type: string;
  event: string | undefined;
  eventFallback: string | undefined;
}

export function artifactPublishRepoKeys(artifactPublishEvents: IArtifactPublishEvents[], artifactType: string, event: string): string[] {
  const repoKeys: string[] = []
  for (const artifactPublishEvent of artifactPublishEvents) {
    if (artifactPublishEvent.artifactRepoKey && artifactPublishEvent.artifactType && artifactPublishEvent.artifactType === artifactType) {
      if (artifactPublishEvent.eventRegex && event.match(artifactPublishEvent.eventRegex)) {
        repoKeys.push(artifactPublishEvent.artifactRepoKey)
      } else if (artifactPublishEvent.event) {
        const eventSegments = event.split('/')
        const compareEvent = artifactPublishEvent.event
        const compareEventSegments = artifactPublishEvent.event.split('/')

        if (eventSegments[0] === 'commit' && eventSegments.length >= 2 && event === compareEvent) {
          repoKeys.push(artifactPublishEvent.artifactRepoKey)
        } else if (eventSegments[0] === 'tag' && eventSegments.length >= 2 && eventSegments.length <= 3) {
          if (event === compareEvent) {
            repoKeys.push(artifactPublishEvent.artifactRepoKey)
          } else if (compareEventSegments.length === 2 && eventSegments[1] === compareEventSegments[1]) {
            repoKeys.push(artifactPublishEvent.artifactRepoKey)
          }
        }
      }
    }
  }

  return repoKeys
}

export class Resolver {
  private resolveArtifactsMap = new Map<string, IResolverArtifact>()

  constructor(conf: IArtifactsResolver, filterArtifactType: string | undefined, filterArtifactName: string | undefined) {
    const resolverBases: IArtifactsResolverBase[] = [conf]
    if (conf.overrides) {
      resolverBases.push(...conf.overrides)
    }

    for (const resolverBase of resolverBases) {
      if (resolverBase.artifacts) {
        for (const [artifactType, artifactNames] of Object.entries(resolverBase.artifacts)) {
          if (filterArtifactType && artifactType !== filterArtifactType) {
            continue
          }
          if (artifactNames) {
            for (const artifactName of artifactNames) {
              if (filterArtifactName && artifactName !== filterArtifactName) {
                continue
              }
              this.resolveArtifactsMap.set(`${artifactType}/${artifactName}`, {
                name: artifactName,
                type: artifactType,
                event: resolverBase.event,
                eventFallback: resolverBase.eventFallback,
              } as IResolverArtifact)
            }
          }
        }
      }
    }
  }

  public async resolveAsync(artifactPublishEvents: IArtifactPublishEvents[], buildVersions: BuildVersions): Promise<IArtifact[]> {
    const artifacts: IArtifact[] = []

    const promiseMap = new Map<string, Promise<IArtifactData>>()
    for (const [key, resolveArtifact] of this.resolveArtifactsMap.entries()) {
      promiseMap.set(key, buildVersions.getArtifactDataAsync(resolveArtifact.type, resolveArtifact.name))
    }

    for (const [key, resolveArtifact] of this.resolveArtifactsMap.entries()) {
      let artifact: IArtifact | undefined
      const artifactData = await promiseMap.get(key)

      const tryEvents = []
      if (resolveArtifact.event) {
        tryEvents.push(resolveArtifact.event)
      }
      if (resolveArtifact.eventFallback) {
        tryEvents.push(resolveArtifact.eventFallback)
      }

      for (const event of tryEvents) {
        const eventSegments = event.split('/')

        const createArtifact = (version: string, repoKey?: string): boolean => {
          if (!repoKey) {
            const repoKeys = artifactPublishRepoKeys(artifactPublishEvents, resolveArtifact.type, event)
            if (repoKeys.length > 0) {
              repoKey = repoKeys[0]
            } else {
              console.error(`warning: artifact '${resolveArtifact.type}/${resolveArtifact.name}' event '${event}' is missing artifactPublishEvents`)
              return false
            }
          }

          artifact = {
            name: resolveArtifact.name,
            type: resolveArtifact.type,
            event: event,
            repoKey: repoKey,
            version: version,
          }
          return true
        }

        if (eventSegments[0] === 'repoVersion' && eventSegments.length === 3) {
          if (createArtifact(eventSegments[2], eventSegments[1])) {
            break
          }
        } else if (eventSegments[0] === 'commit' && eventSegments.length >= 2) {
          const branch = eventSegments.splice(1).join('/')
          const version = artifactData?.commitMap?.[branch]
          if (version) {
            if (createArtifact(version)) {
              break
            }
          }
        } else if (eventSegments[0] === 'tag' && eventSegments.length >= 2 && eventSegments.length <= 3) {
          const tagType = eventSegments[1]
          let versionRange = eventSegments.length > 2 ? eventSegments[2] : '*.*.*'
          const versions = []
          const semverOptions: semver.Options = {}
          if (tagType !== 'release') {
            semverOptions.includePrerelease = true
            versionRange += `-${tagType}`
            const rcVersions = artifactData?.tagMap?.[tagType]
            if (rcVersions) {
              versions.push(...rcVersions)
            }
          }
          const releaseVersion = artifactData?.tagMap?.['release']
          if (releaseVersion) {
            versions.push(...releaseVersion)
          }
          const version = semver.maxSatisfying(versions, versionRange, semverOptions)
          if (version) {
            if (createArtifact(version)) {
              break
            }
          }
        } else {
          console.error(`warning: artifact '${resolveArtifact.type}/${resolveArtifact.name}' has invalid event '${event}'`)
        }
      }

      if (artifact) {
        artifacts.push(artifact)
      } else {
        console.error(`warning: artifact '${resolveArtifact.type}/${resolveArtifact.name}' has no matching versions`)
      }
    }
    return artifacts
  }
}
