import {artifactPublishRepoKeys, Resolver} from '../artifact/Resolver'
import {IGlobalConfig} from '../../spec/global/IGlobalConfig'
import {IBuild} from '../../spec/repo/IBuild'
import {IArtifact} from '../artifact/IArtifact'
import {BuildVersions} from '../../buildVersions/BuildVersions'
import {detectGitRepoAsync} from '../../git/GitRepo'

export class Build {
  public buildConfig: IBuild

  public globalConfig: IGlobalConfig

  public outputType: string

  constructor(globalConfig: IGlobalConfig, buildConfig: IBuild, outputType: string) {
    this.globalConfig = globalConfig
    this.buildConfig = buildConfig
    this.outputType = outputType
  }

  public async listDependenciesAsync(filterArtifactType: string | undefined): Promise<IArtifact[]> {
    if (!this.buildConfig.dependencies) {
      console.error('warning: build.dependencies is not set')
      return []
    }
    if (!this.buildConfig.artifactPublishEvents) {
      console.error('warning: build.artifactPublishEvents is not set')
      return []
    }
    const buildVersions = new BuildVersions(this.globalConfig)
    await buildVersions.initAsync()

    const resolver = new Resolver(this.buildConfig.dependencies, filterArtifactType)
    return resolver.resolveAsync(this.buildConfig.artifactPublishEvents, buildVersions)
  }

  public async listPublishAsync(filterArtifactType: string | undefined, event: string | undefined): Promise<IArtifact[]> {
    if (!this.buildConfig.artifacts) {
      console.error('warning: build.artifacts is not set')
      return []
    }
    if (!this.buildConfig.artifactPublishEvents) {
      console.error('warning: build.artifactPublishEvents is not set')
      return []
    }

    const gitRepo = await detectGitRepoAsync(this.globalConfig, '.')
    if (event) {
      const eventSegments = event.split('/')
      if (eventSegments[0] !== 'commit') {
        throw new Error("--event must start with 'commit/'")
      }
    } else {
      const branchName = await gitRepo.branchNameAsync()
      event = `commit/${branchName}`
    }
    const hashShort = await gitRepo.hashShortAsync()
    const version = `build-${hashShort}`

    const artifacts: IArtifact[] = []
    for (const [artifactType, artifactNames] of Object.entries(this.buildConfig.artifacts)) {
      if (filterArtifactType && artifactType !== filterArtifactType) {
        continue
      }
      if (artifactNames) {
        for (const artifactName of artifactNames) {
          for (const repoKey of artifactPublishRepoKeys(this.buildConfig.artifactPublishEvents, artifactType, event)) {
            artifacts.push({
              name: artifactName,
              type: artifactType,
              event: event,
              repoKey: repoKey,
              version: version,
            } as IArtifact)
          }
        }
      }
    }

    return artifacts
  }

  public async completePublishAsync(filterArtifactType: string | undefined, event: string | undefined): Promise<IArtifact[]> {
    const artifactSet = new Set<string>()
    const artifacts = await this.listPublishAsync(filterArtifactType, event)

    const buildVersions = new BuildVersions(this.globalConfig)
    await buildVersions.initAsync()

    const promises: Promise<void>[] = []
    for (const artifact of artifacts) {
      const key = `${artifact.type}/${artifact.name}`
      if (artifactSet.has(key)) {
        continue
      }
      promises.push((async () => {
        const artifactData = await buildVersions.getArtifactDataAsync(artifact.type, artifact.name)
        const eventKey = artifact.event.substr('commit/'.length)
        artifactData.commitMap[eventKey] = artifact.version
      })())
    }

    await Promise.all(promises)
    if (await buildVersions.saveAsync()) {
      await buildVersions.gitRepo.commitAndPushAsync('update build versions')
    }
    return artifacts
  }
}
