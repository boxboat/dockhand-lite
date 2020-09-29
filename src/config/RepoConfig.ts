import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {IRepoConfig} from '../spec/repo/IRepoConfig'
import {cloneDeep, merge} from 'lodash'
import {parseConfigsAsync} from './ConfigReader'

function repoConfigMerge(...configs: IRepoConfig[]): IRepoConfig {
  const base = {
    build: {},
    promote: {},
    deploy: {},
  } as IRepoConfig

  for (const config of configs) {
    merge(base, config)
  }

  if (base.common) {
    merge(cloneDeep(base.common), base.build)
    merge(cloneDeep(base.common), base.promote)
    merge(cloneDeep(base.common), base.deploy)
  }

  return base
}

export async function parseRepoConfigAsync(globalConfig: IGlobalConfig, configFiles: string[]): Promise<IRepoConfig> {
  const configs = await parseConfigsAsync<IRepoConfig>('#/definitions/IRepoConfig', configFiles)
  return repoConfigMerge(globalConfig.repo, ...configs)
}
