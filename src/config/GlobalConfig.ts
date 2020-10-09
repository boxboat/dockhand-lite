import {IGlobalConfig} from '../spec/global/IGlobalConfig'
import {merge} from 'lodash'
import {parseMultiConfigAsync} from './ConfigReader'

function globalConfigMerge(...configs: IGlobalConfig[]): IGlobalConfig {
  const base = {} as IGlobalConfig

  for (const config of configs) {
    merge(base, config)
  }

  return base
}

export async function parseGlobalConfigAsync(configFiles: string[]) {
  const configs = await parseMultiConfigAsync<IGlobalConfig>('#/definitions/IGlobalConfig', configFiles)
  return globalConfigMerge(...configs)
}
