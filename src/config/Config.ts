import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {IBuild} from '../spec/repo/IBuild'
import {IDeploy} from '../spec/repo/IDeploy'
import {IPromote} from '../spec/repo/IPromote'
import {parseGlobalConfigAsync} from './GlobalConfig'
import {parseRepoConfigAsync} from './RepoConfig'

export type Config = {
  global: IGlobalConfig;
  build: IBuild;
  promote: IPromote;
  deploy: IDeploy;
}

export async function parseConfigAsync(globalConfig: string[], repoConfig: string[]): Promise<Config> {
  const {global, globalRepo} = await parseGlobalConfigAsync(globalConfig)
  const repo = await parseRepoConfigAsync(globalRepo, repoConfig)
  return Object.assign({}, {global}, repo)
}
