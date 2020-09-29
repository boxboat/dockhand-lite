import {IEvent, IEventFallback, IEventRegex} from '../base/IEvent'
import {IOverrides} from '../base/IEventOverrides'
import {ITrigger} from '../base/ITrigger'
import {ICommon} from './ICommon'

type IDeployBase = ICommon & IOverrides

export interface IDeploy extends IDeployBase {
  deploymentMap: Map<string, IDeployment>;
}

type IDeploymentBase = IEvent & IEventFallback & IEventRegex & IOverrides & ITrigger

export interface IDeployment extends IDeploymentBase {
  environmentKey: string;
  group: string;
}
