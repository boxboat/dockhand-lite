import {Resolver} from '../artifact/Resolver'
import {IGlobalConfig} from '../../spec/global/IGlobalConfig'
import {IDeploy} from '../../spec/repo/IDeploy'
import {IArtifact} from '../artifact/Artifact'
import {BuildVersions} from '../../buildVersions/BuildVersions'

export class Deploy {
  public deployConfig: IDeploy

  public globalConfig: IGlobalConfig

  constructor(globalConfig: IGlobalConfig, deployConfig: IDeploy) {
    this.globalConfig = globalConfig
    this.deployConfig = deployConfig
  }

  public async environmentAsync(deploymentKey: string): Promise<any> {
    if (!this.deployConfig.deploymentMap) {
      console.error('warning: deploy.deploymentMap is not set')
      return {}
    }
    const deployment = this.deployConfig.deploymentMap[deploymentKey]
    if (!deployment) {
      console.error(`warning: deploy.deploymentMap.${deploymentKey} is not set`)
      return {}
    }
    if (!deployment.environmentKey) {
      console.error(`warning: deploy.deploymentMap.${deploymentKey}.environmentKey is not set`)
      return {}
    }
    if (!this.globalConfig.environmentMap) {
      console.error('warning: environmentMap is not set')
      return {}
    }
    const environment = this.globalConfig.environmentMap[deployment.environmentKey]
    if (!environment) {
      console.error(`warning: environmentMap.${deployment.environmentKey} is not set`)
      return {}
    }
    return environment
  }

  public async listDependenciesAsync(deploymentKey: string, filterArtifactType: string | undefined, filterArtifactName: string | undefined): Promise<IArtifact[]> {
    if (!this.deployConfig.deploymentMap) {
      console.error('warning: deploy.deploymentMap is not set')
      return []
    }
    const deployment = this.deployConfig.deploymentMap[deploymentKey]
    if (!deployment) {
      console.error(`warning: deploy.deploymentMap.${deploymentKey} is not set`)
      return []
    }
    if (!this.deployConfig.artifactPublishEvents) {
      console.error('warning: deploy.artifactPublishEvents is not set')
      return []
    }
    const buildVersions = new BuildVersions(this.globalConfig)
    await buildVersions.initAsync()

    const resolver = new Resolver(deployment, filterArtifactType, filterArtifactName)
    return resolver.resolveAsync(this.deployConfig.artifactPublishEvents, this.globalConfig.artifactRepoMap, buildVersions)
  }
}
