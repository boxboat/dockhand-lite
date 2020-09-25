import {IArtifacts, IArtifactType} from '../base/IArtifacts'
import {IEvent, IEventRegex} from '../base/IEvent'

export interface ICommon extends IArtifacts {
  artifactPublishEvents: Array<IArtifactPublishEvents>;
  ciProvider: IGitLabCiProvider;
  defaultBranch: string;
  name: string;
  updateMethod: IFileUpdateMethod | IOrphanBranchUpdateMethod;
}

type IArtifactPublishEventsBase = IArtifactType & IEvent & IEventRegex;

export interface IArtifactPublishEvents extends IArtifactPublishEventsBase {
  artifactRepoKey: string;
}
