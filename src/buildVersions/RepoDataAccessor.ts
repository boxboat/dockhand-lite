import {isObject} from 'lodash'
import {IRepoData} from '../spec/buildVersions/IBuildVersions'
import {BuildVersions} from './BuildVersions'
import {DataAccessor} from './DataAccessor'

export class RepoDataAccessor extends DataAccessor<IRepoData> {
  private gitConnectionKey: string

  private gitRepoPath: string

  constructor(buildVersions: BuildVersions, gitConnectionKey: string, gitRepoPath: string) {
    super(buildVersions)
    this.gitConnectionKey = gitConnectionKey
    this.gitRepoPath = gitRepoPath
  }

  protected get fileSegments(): string[] {
    return ['repos', this.gitConnectionKey, ...this.gitRepoPath.split(/\/|\\/)]
  }

  protected initData(data: IRepoData | undefined): IRepoData {
    if (!isObject(data)) {
      return {
        tagPrefixMap: {},
      }
    }
    if (!isObject(data.tagPrefixMap)) {
      data.tagPrefixMap = {}
    }
    return data
  }
}
