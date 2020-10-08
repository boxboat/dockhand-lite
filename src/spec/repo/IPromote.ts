import {IArtifactsResolver} from '../base/IArtifacts'
import {ICommon} from './ICommon'

export interface IPromote extends ICommon {
  gitTagDisable: boolean;
  gitTagPrefix: string;
  promotionMap: Record<string, IPromotion>;
}

export interface IPromotion extends IArtifactsResolver {
  promoteToEvent: string | undefined;
}
