import {IGlobalConfig, IGlobalConfigFile} from '../spec/global/IGlobalConfig'
import {merge} from 'lodash'
import {parseMultiConfigAsync} from './ConfigReader'

function globalConfigMerge(...configs: IGlobalConfigFile[]): IGlobalConfigFile {
  const base = {
    repo: {
      common: {},
      build: {},
      promote: {},
      deploy: {},
    },
  } as IGlobalConfigFile

  for (const config of configs) {
    merge(base, config)
  }

  return base
}

export async function parseGlobalConfigAsync(configFiles: string[]) {
  const configs = await parseMultiConfigAsync<IGlobalConfigFile>('#/definitions/IGlobalConfigFile', configFiles)
  const globalFile = globalConfigMerge(...configs)
  const globalRepo = globalFile.repo
  const global = globalFile as IGlobalConfig
  delete (global as any).repo
  return {global, globalRepo}
}
