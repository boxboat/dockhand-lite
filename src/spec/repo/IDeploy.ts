import {IArtifactsResolver, IArtifactsResolverOverrides} from '../base/IArtifacts'
import {IEventRegex} from '../base/IEvent'
import {ITrigger} from '../base/ITrigger'
import {ICommon} from './ICommon'

type IDeployBase = ICommon & IArtifactsResolverOverrides

export interface IDeploy extends IDeployBase {
  deploymentMap: Record<string, IDeployment> | undefined;
}

type IDeploymentBase = IArtifactsResolver & IEventRegex & ITrigger

export interface IDeployment extends IDeploymentBase {
  environmentKey: string | undefined;
  group: string | undefined;
}
