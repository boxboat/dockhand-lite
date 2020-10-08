import {Command} from '@oclif/command'
import {globalFlags, artifactTypeOptionalFlag, eventOptionalFlag} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Build} from '../../lib/build/Build'
import {output} from '../../utils/utils'

export default class BuildListPublish extends Command {
  static description = 'list of artifacts that should be published'

  static flags = Object.assign({}, globalFlags, artifactTypeOptionalFlag, eventOptionalFlag)

  async run() {
    const {flags} = this.parse(BuildListPublish)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const build = new Build(config.global, config.build, flags.outputType)
    const data = await build.listPublishAsync(flags.artifactType, flags.event)
    output(flags.outputType, data)
  }
}
