import {IArtifacts, IArtifactType} from '../base/IArtifacts'
import {IEvent, IEventRegex} from '../base/IEvent'
import {ITrigger} from '../base/ITrigger'

type ICommonBase = IArtifacts & ITrigger;

export interface ICommon extends ICommonBase {
  artifactPublishEvents: IArtifactPublishEvents[] | undefined;
  name: string | undefined;
}

type IArtifactPublishEventsBase = IArtifactType & IEvent & IEventRegex;

export interface IArtifactPublishEvents extends IArtifactPublishEventsBase {
  artifactRepoKey: string | undefined;
}
