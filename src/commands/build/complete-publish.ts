import {Command} from '@oclif/command'
import {
  globalFlags,
  artifactNameOptionalFlag,
  artifactTypeOptionalFlag,
  gitRemoteFlags,
  eventOptionalFlag,
  tagFlags,
  versionPrefixFlag,
} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Build} from '../../lib/build/Build'
import {output} from '../../utils/utils'

export default class BuildCompletePublish extends Command {
  static description = 'save new versions of published artifacts'

  static flags = {
    ...gitRemoteFlags,
    ...globalFlags,
    ...artifactNameOptionalFlag,
    ...artifactTypeOptionalFlag,
    ...eventOptionalFlag,
    ...tagFlags,
    ...versionPrefixFlag,
  }

  async run() {
    const {flags} = this.parse(BuildCompletePublish)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const build = new Build(config.global, config.build)
    const data = await build.completePublishAsync(
      flags.artifactType,
      flags.artifactName,
      flags.event,
      flags.versionPrefix,
      flags.tag,
      flags.tagTip,
      flags.gitRemote,
      flags.gitRemoteRef)
    output(data, flags.outputType, flags.outputPrefix)
  }
}
