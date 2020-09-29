import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {IRepoConfig} from '../spec/repo/IRepoConfig'
import {parseGlobalConfigAsync} from './GlobalConfig'
import {parseRepoConfigAsync} from './RepoConfig'

export type Config = {
  global: IGlobalConfig;
  repo: IRepoConfig;
}

export async function parseConfigAsync(globalConfigStr: string, repoConfigStr: string): Promise<Config> {
  const global = await parseGlobalConfigAsync(globalConfigStr.split(','))
  const repo = await parseRepoConfigAsync(global, repoConfigStr.split(','))
  return {global, repo}
}
