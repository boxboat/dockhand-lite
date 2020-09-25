import {IEvent, IEventFallback, IEventRegex} from '../base/IEvent'
import {IEventOverrides} from '../base/IEventOverrides'
import {ITrigger} from '../base/ITrigger'
import {ICommon} from './ICommon'

type IDeployBase = ICommon & IEventOverrides

export interface IDeploy extends IDeployBase {
  deploymentMap: Map<string, IDeployment>;
}

type IDeploymentBase = IEvent & IEventFallback & IEventRegex & IEventOverrides & ITrigger

export interface IDeployment extends IDeploymentBase {
  environmentKey: string;
  group: string;
}
