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

export default class BuildListPublish extends Command {
  static description = 'list of artifacts that should be published'

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
    const {flags} = this.parse(BuildListPublish)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const build = new Build(config.global, config.build)
    const data = await build.listPublishAsync(
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
