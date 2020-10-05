import {IEvent} from '../base/IEvent'
import {ICommon} from './ICommon'

export interface IPromote extends ICommon {
  gitTagDisable: boolean;
  gitTagPrefix: string;
  promotionMap: Record<string, IPromotion>;
}

export interface IPromotion extends IEvent {
  promoteToEvent: string | undefined;
}
