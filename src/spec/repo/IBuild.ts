import {IArtifactsResolver} from '../base/IArtifacts'
import {ICommon} from './ICommon'

export interface IBuild extends ICommon {
  dependencies: IArtifactsResolver | undefined;
}
