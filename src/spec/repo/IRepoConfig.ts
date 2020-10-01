import {IBuild} from './IBuild'
import {ICommon} from './ICommon'
import {IDeploy} from './IDeploy'
import {IPromote} from './IPromote'

export interface IRepoConfig {
  build: IBuild;
  promote: IPromote;
  deploy: IDeploy;
}

export interface IRepoConfigFile extends IRepoConfig {
  common: ICommon;
}
