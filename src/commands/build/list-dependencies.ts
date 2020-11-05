import {Command} from '@oclif/command'
import {artifactNameOptionalFlag, artifactTypeOptionalFlag, globalFlags, outputMapFlag} from '../../flags/Flags'
import {parseConfigAsync} from '../../config/Config'
import {Build} from '../../lib/build/Build'
import {output} from '../../utils/utils'
import {artifactListToMap} from '../../lib/artifact/Artifact'

export default class BuildListDependencies extends Command {
  static description = 'list of artifacts that are dependencies'

  static flags = {
    ...globalFlags,
    ...artifactNameOptionalFlag,
    ...artifactTypeOptionalFlag,
    ...outputMapFlag,
  }

  async run() {
    const {flags} = this.parse(BuildListDependencies)
    const config = await parseConfigAsync(flags.globalConfig, flags.repoConfig)
    const build = new Build(config.global, config.build)
    const data = await build.listDependenciesAsync(flags.artifactType, flags.artifactName)
    output(data, flags.outputType, flags.outputPrefix, {
      map: flags.outputMap,
      mapFormatter: artifactListToMap,
      tableExcludeKeys: ['repo'],
    })
  }
}
