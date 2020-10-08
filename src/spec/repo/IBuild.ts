import {IArtifactsResolver} from '../base/IArtifacts'
import {ITrigger} from '../base/ITrigger'
import {ICommon} from './ICommon'

export interface IBuild extends ICommon {
  dependencies: IArtifactsResolver & ITrigger | undefined;
}
