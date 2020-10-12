import {artifactPublishRepoKeys, Resolver} from '../artifact/Resolver'
import {IGlobalConfig} from '../../spec/global/IGlobalConfig'
import {IBuild} from '../../spec/repo/IBuild'
import {IArtifact} from '../artifact/Artifact'
import {BuildVersions} from '../../buildVersions/BuildVersions'
import {detectGitRepoAsync, GitRepo} from '../../git/GitRepo'
import {alphaNumericDash} from '../../utils/utils'

export class Build {
  public buildConfig: IBuild

  public globalConfig: IGlobalConfig

  private gitRepo: GitRepo | undefined

  constructor(globalConfig: IGlobalConfig, buildConfig: IBuild) {
    this.globalConfig = globalConfig
    this.buildConfig = buildConfig
  }

  public async listDependenciesAsync(filterArtifactType: string | undefined, filterArtifactName: string | undefined): Promise<IArtifact[]> {
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

    const resolver = new Resolver(this.buildConfig.dependencies, filterArtifactType, filterArtifactName)
    return resolver.resolveAsync(this.buildConfig.artifactPublishEvents, this.globalConfig.artifactRepoMap, buildVersions)
  }

  public async listPublishAsync(filterArtifactType: string | undefined, filterArtifactName: string | undefined, forceEvent: string | undefined): Promise<IArtifact[]> {
    if (!this.buildConfig.artifacts) {
      console.error('warning: build.artifacts is not set')
      return []
    }
    if (!this.buildConfig.artifactPublishEvents) {
      console.error('warning: build.artifactPublishEvents is not set')
      return []
    }

    const gitRepo = await this.gitRepoAsync()
    const hashShort = await gitRepo.hashShortAsync()
    const versions: string[] = [`build-${hashShort}`]
    const {event, branch} = await this.eventBranchAsync(forceEvent)
    if (await gitRepo.isBranchTipAsync(branch)) {
      versions.push(`commit-${alphaNumericDash(branch)}`)
    }

    const artifacts: IArtifact[] = []
    for (const [artifactType, artifactNames] of Object.entries(this.buildConfig.artifacts)) {
      if (filterArtifactType && artifactType !== filterArtifactType) {
        continue
      }
      if (artifactNames) {
        for (const artifactName of artifactNames) {
          if (filterArtifactName && artifactName !== filterArtifactName) {
            continue
          }
          for (const repoKey of artifactPublishRepoKeys(this.buildConfig.artifactPublishEvents, artifactType, event)) {
            for (const version of versions) {
              artifacts.push({
                name: artifactName,
                type: artifactType,
                event: event,
                repoKey: repoKey,
                repo: this.globalConfig.artifactRepoMap?.[repoKey],
                version: version,
              })
            }
          }
        }
      }
    }

    return artifacts
  }

  public async completePublishAsync(filterArtifactType: string | undefined, filterArtifactName: string | undefined, forceEvent: string | undefined): Promise<IArtifact[]> {
    const artifactSet = new Set<string>()
    const artifacts = await this.listPublishAsync(filterArtifactType, filterArtifactName, forceEvent)

    const gitRepo = await this.gitRepoAsync()
    const {branch} = await this.eventBranchAsync(forceEvent)

    if (await gitRepo.isBranchTipAsync(branch)) {
      const buildVersions = new BuildVersions(this.globalConfig)
      await buildVersions.initAsync()

      const promises: Promise<void>[] = []
      for (const artifact of artifacts) {
        const key = `${artifact.type}/${artifact.name}`
        if (artifactSet.has(key)) {
          continue
        }
        artifactSet.add(key)
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
    }

    return artifacts
  }

  private async gitRepoAsync(): Promise<GitRepo> {
    if (!this.gitRepo) {
      this.gitRepo = await detectGitRepoAsync(this.globalConfig, '.')
    }
    return this.gitRepo
  }

  private async eventBranchAsync(event: string | undefined) {
    const gitRepo = await this.gitRepoAsync()
    let branch
    if (event) {
      const eventSegments = event.split('/')
      if (eventSegments[0] !== 'commit') {
        throw new Error("--event must start with 'commit/'")
      }
      branch = eventSegments.splice(1).join('/')
    } else {
      branch = await gitRepo.branchNameAsync()
      event = `commit/${branch}`
    }
    return {event, branch}
  }
}
