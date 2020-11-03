import {IArtifactsResolver} from '../base/IArtifacts'
import {ICommon} from './ICommon'

export interface IPromote extends ICommon {
  baseVersion: string | undefined;
  gitTagDisable: boolean | undefined;
  promotionMap: Record<string, IPromotion> | undefined;
  tagPrefix: string | undefined;
}

export interface IPromotion extends IArtifactsResolver {
  promoteToEvent: string | undefined;
}
