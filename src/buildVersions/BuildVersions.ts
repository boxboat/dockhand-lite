import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {GitRepo} from '../git/GitRepo'
import {ArtifactDataAccessor} from './ArtifactDataAccessor'
import {RepoDataAccessor} from './RepoDataAccessor'
import {IArtifactData, IRepoData} from '../spec/buildVersions/IBuildVersions'
import {IDataAccessor} from './IDataAccessor'

export class BuildVersions {
  public gitRepo: GitRepo

  private globalConfig: IGlobalConfig

  private artifactDataAccessorMap: Map<string, ArtifactDataAccessor> = new Map<string, ArtifactDataAccessor>()

  private repoDataAccessorMap: Map<string, RepoDataAccessor> = new Map<string, RepoDataAccessor>()

  constructor(globalConfig: IGlobalConfig) {
    this.globalConfig = globalConfig
    if (!globalConfig.buildVersions?.gitRepo) {
      throw new Error('buildVersions.gitRepo is required')
    }
    this.gitRepo = new GitRepo(globalConfig, globalConfig.buildVersions.gitRepo)
  }

  public async initAsync() {
    await this.gitRepo.ensureClonedAsync('--depth=1')
  }

  public async getArtifactDataAsync(artifactType: string, artifactName: string): Promise<IArtifactData> {
    const key = `${artifactType}/${artifactName}`
    let dataAccessor = this.artifactDataAccessorMap.get(key)
    if (!dataAccessor) {
      dataAccessor = new ArtifactDataAccessor(this, artifactType, artifactName)
      this.artifactDataAccessorMap.set(key, dataAccessor)
    }
    return dataAccessor.dataAsync()
  }

  public async getRepoDataAsync(gitConnectionKey: string, gitRepoPath: string): Promise<IRepoData> {
    const key = `${gitConnectionKey}/${gitRepoPath}`
    let dataAccessor = this.repoDataAccessorMap.get(key)
    if (!dataAccessor) {
      dataAccessor = new RepoDataAccessor(this, gitConnectionKey, gitRepoPath)
      this.repoDataAccessorMap.set(key, dataAccessor)
    }
    return dataAccessor.dataAsync()
  }

  public async saveAsync(message = 'update build versions'): Promise<boolean> {
    const dataAccessors: IDataAccessor[] = [
      ...this.artifactDataAccessorMap.values(),
      ...this.repoDataAccessorMap.values(),
    ]
    const promises: Promise<boolean>[] = []
    for (const dataAccessor of dataAccessors) {
      promises.push(dataAccessor.saveAsync())
    }
    let result = false
    for (const promise of promises) {
      result = result || await promise
    }
    if (result) {
      await this.gitRepo.commitAndPushAsync(message)
    }
    return result
  }
}

