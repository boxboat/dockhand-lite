import {IRepoConfig} from '../spec/repo/IRepoConfig'
import {cloneDeep, merge} from 'lodash'
import {parseMultiConfigAsync} from './ConfigReader'

function repoConfigMerge(...configs: IRepoConfig[]): IRepoConfig {
  const base = {
    common: {},
    build: {},
    promote: {},
    deploy: {},
  } as IRepoConfig

  merge(base, ...configs)
  base.build = merge(cloneDeep(base.common), base.build)
  base.promote = merge(cloneDeep(base.common), base.promote)
  base.deploy = merge(cloneDeep(base.common), base.deploy)

  if (base.promote.artifacts && base.promote.promotionMap) {
    for (const [key, promotion] of Object.entries(base.promote.promotionMap)) {
      const promoteArtifacts = promotion.artifacts ?? {}
      base.promote.promotionMap[key].artifacts = merge(cloneDeep(base.promote.artifacts), promoteArtifacts)
    }
  }
  if (base.deploy.artifacts && base.deploy.deploymentMap) {
    for (const [key, deployment] of Object.entries(base.deploy.deploymentMap)) {
      const deployArtifacts = deployment.artifacts ?? {}
      base.deploy.deploymentMap[key].artifacts = merge(cloneDeep(base.deploy.artifacts), deployArtifacts)
    }
  }

  return base
}

export async function parseRepoConfigAsync(configFiles: string[]) {
  const configs = await parseMultiConfigAsync<IRepoConfig>('#/definitions/IRepoConfig', configFiles)
  return repoConfigMerge(...configs)
}
