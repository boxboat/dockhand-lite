import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {merge} from 'lodash'
import {parseConfigsAsync} from './ConfigReader'

function globalConfigMerge(...configs: IGlobalConfig[]): IGlobalConfig {
  const base = {} as IGlobalConfig

  for (const config of configs) {
    merge(base, config)
  }

  return base
}

export async function parseGlobalConfigAsync(configFiles: string[]): Promise<IGlobalConfig> {
  const configs = await parseConfigsAsync<IGlobalConfig>('#/definitions/IGlobalConfig', configFiles)
  return globalConfigMerge(...configs)
}
