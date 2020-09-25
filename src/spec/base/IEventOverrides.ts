import {IArtifacts} from './IArtifacts'
import {IEvent, IEventFallback} from './IEvent'

export interface IEventOverrides {
  eventOverrides: Array<IEventOverride>;
}

type IEventOverride = IArtifacts & IEvent & IEventFallback
