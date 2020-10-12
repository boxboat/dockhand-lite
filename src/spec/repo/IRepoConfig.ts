import {IBuild} from './IBuild'
import {ICommon} from './ICommon'
import {IDeploy} from './IDeploy'
import {IPromote} from './IPromote'

export interface IRepoConfig {
  common: ICommon;
  build: IBuild;
  promote: IPromote;
  deploy: IDeploy;
}
