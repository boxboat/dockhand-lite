import {IEvent} from '../base/IEvent'
import {ICommon} from './ICommon'

export interface IPromote extends ICommon {
  baseVersion: string;
  gitTagDisable: boolean;
  gitTagPrefix: string;
  promotionMap: Map<string, IPromotion>;
}

export interface IPromotion extends IEvent {
  promoteToEvent: string;
}
