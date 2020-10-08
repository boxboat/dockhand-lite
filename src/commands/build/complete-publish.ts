import {Command} from '@oclif/command'
import {globalFlags, artifactNameOptionalFlag, artifactTypeOptionalFlag, eventOptionalFlag} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Build} from '../../lib/build/Build'
import {output} from '../../utils/utils'

export default class BuildCompletePublish extends Command {
  static description = 'save new versions of published artifacts'

  static flags = {
    ...globalFlags,
    ...artifactNameOptionalFlag,
    ...artifactTypeOptionalFlag,
    ...eventOptionalFlag,
  }

  async run() {
    const {flags} = this.parse(BuildCompletePublish)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const build = new Build(config.global, config.build, flags.outputType)
    const data = await build.completePublishAsync(flags.artifactType, flags.artifactName, flags.event)
    output(flags.outputType, data)
  }
}
