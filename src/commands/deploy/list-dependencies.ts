import {Command} from '@oclif/command'
import {artifactNameOptionalFlag, artifactTypeOptionalFlag, deploymentRequiredFlag, globalFlags, outputMapFlag} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Deploy} from '../../lib/deploy/Deploy'
import {output} from '../../utils/utils'
import {artifactListToMap} from '../../lib/artifact/Artifact'

export default class DeployListDependencies extends Command {
  static description = 'list of artifacts that are dependencies'

  static flags = {
    ...globalFlags,
    ...deploymentRequiredFlag,
    ...artifactNameOptionalFlag,
    ...artifactTypeOptionalFlag,
    ...outputMapFlag,
  }

  async run() {
    const {flags} = this.parse(DeployListDependencies)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const deploy = new Deploy(config.global, config.deploy)
    const data = await deploy.listDependenciesAsync(flags.deployment, flags.artifactType, flags.artifactName)
    output(data, flags.outputType, flags.outputPrefix, {
      map: flags.outputMap,
      mapFormatter: artifactListToMap,
    })
  }
}
