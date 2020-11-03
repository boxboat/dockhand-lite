import {IRepoTriggers} from '../spec/buildVersions/IBuildVersions'
import {BuildVersions} from './BuildVersions'
import {DataAccessor} from './DataAccessor'

export class RepoTriggersAccessor extends DataAccessor<IRepoTriggers> {
  private gitConnectionKey: string

  private gitRepoPath: string

  private triggerDir: string

  constructor(buildVersions: BuildVersions, gitConnectionKey: string, gitRepoPath: string, triggerType: string, triggerName: string | undefined) {
    super(buildVersions)
    this.gitConnectionKey = gitConnectionKey
    this.gitRepoPath = gitRepoPath.replace(/\.git$/, '')
    this.triggerDir = triggerType
    if (triggerName) {
      this.triggerDir += `.${triggerName}`
    }
  }

  protected get fileSegments(): string[] {
    return ['repos', this.gitConnectionKey, ...this.gitRepoPath.split('/'), 'triggers', this.triggerDir]
  }

  protected get schemaRef(): string {
    return '#/definitions/ITriggers'
  }

  protected initData(): IRepoTriggers {
    return []
  }
}
