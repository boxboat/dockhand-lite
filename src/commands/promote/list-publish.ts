import {Command} from '@oclif/command'
import {
  globalFlags,
  artifactNameOptionalFlag,
  artifactTypeOptionalFlag,
  eventOptionalFlag,
  gitConnectionFlags,
  promotionRequiredFlag,
  tagFlags,
  versionOptionalFlag,
} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Promote} from '../../lib/promote/Promote'
import {output} from '../../utils/utils'

export default class PromoteListPublish extends Command {
  static description = 'list of artifacts that should be published'

  static flags = {
    ...globalFlags,
    ...artifactNameOptionalFlag,
    ...artifactTypeOptionalFlag,
    ...eventOptionalFlag,
    ...gitConnectionFlags,
    ...promotionRequiredFlag,
    ...tagFlags,
    ...versionOptionalFlag,
  }

  async run() {
    const {flags} = this.parse(PromoteListPublish)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const promote = new Promote(config.global, config.promote)
    const data = await promote.listPublishAsync(
      flags.promotion,
      flags.artifactType,
      flags.artifactName,
      flags.event,
      flags.version,
      flags.gitConnectionKey,
      flags.gitConnectionPath,
      flags.tag,
      flags.tagTip)
    output(data, flags.outputType, flags.outputPrefix)
  }
}
