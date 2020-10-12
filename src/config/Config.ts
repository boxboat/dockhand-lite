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

export async function parseConfigAsync(globalConfig: string | string[], repoConfig: string | string[]): Promise<Config> {
  if (!Array.isArray(globalConfig)) {
    globalConfig = globalConfig.split(':')
  }
  if (!Array.isArray(repoConfig)) {
    repoConfig = repoConfig.split(':')
  }
  const global = await parseGlobalConfigAsync(globalConfig)
  const repo = await parseRepoConfigAsync(repoConfig)
  return {
    global,
    build: repo.build,
    promote: repo.promote,
    deploy: repo.deploy,
  }
}
