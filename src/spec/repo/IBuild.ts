import {IArtifacts} from '../base/IArtifacts'
import {IEvent, IEventFallback} from '../base/IEvent'
import {IOverrides} from '../base/IEventOverrides'
import {ITrigger} from '../base/ITrigger'
import {ICommon} from './ICommon'

export interface IBuild extends ICommon {
  dependencies: IDependencies;
}

type IDependencies = IArtifacts & IEvent & IEventFallback & IOverrides & ITrigger
