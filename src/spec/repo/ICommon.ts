import {IArtifacts, IArtifactType} from '../base/IArtifacts'
import {IEvent, IEventRegex} from '../base/IEvent'

export interface ICommon extends IArtifacts {
  artifactPublishEvents: IArtifactPublishEvents[] | undefined;
  ciProvider: IGitLabCiProvider | undefined;
  defaultBranch: string | undefined;
  name: string | undefined;
  updateMethod: IFileUpdateMethod | IOrphanBranchUpdateMethod | undefined;
}

type IArtifactPublishEventsBase = IArtifactType & IEvent & IEventRegex;

export interface IArtifactPublishEvents extends IArtifactPublishEventsBase {
  artifactRepoKey: string | undefined;
}
