import {Command} from '@oclif/command'
import {deploymentRequiredFlag, globalFlags} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Deploy} from '../../lib/deploy/Deploy'
import {output} from '../../utils/utils'

export default class DeployListDependencies extends Command {
  static description = 'list of artifacts that are dependencies'

  static flags = {
    ...globalFlags,
    ...deploymentRequiredFlag,
  }

  async run() {
    const {flags} = this.parse(DeployListDependencies)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const deploy = new Deploy(config.global, config.deploy)
    const data = await deploy.environmentAsync(flags.deployment)
    output(data, flags.outputType, flags.outputPrefix)
  }
}
