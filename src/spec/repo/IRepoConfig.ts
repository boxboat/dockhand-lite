import {IBuild} from './IBuild'
import {IDeploy} from './IDeploy'
import {IPromote} from './IPromote'

export interface IRepoConfig {
  build: IBuild;
  deploy: IDeploy;
  promote: IPromote;
}
