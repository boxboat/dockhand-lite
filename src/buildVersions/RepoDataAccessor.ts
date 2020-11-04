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

  protected get schemaRef(): string {
    return '#/definitions/IRepoData'
  }

  protected initData(): IRepoData {
    return {
      tagPrefixMap: {},
    }
  }
}
