import {IEvent} from '../base/IEvent'
import {ICommon} from './ICommon'

export interface IPromote extends ICommon {
  baseVersion: string | undefined;
  gitTagDisable: boolean | undefined;
  gitTagPrefix: string | undefined;
  promotionMap: Map<string, IPromotion> | undefined;
}

export interface IPromotion extends IEvent {
  promoteToEvent: string | undefined;
}
