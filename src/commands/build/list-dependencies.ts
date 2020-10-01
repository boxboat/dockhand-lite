import {Command} from '@oclif/command'
import {artifactTypeFlag, configFlags, helpFlag} from '../../flags'
import {parseConfigAsync} from '../../config'

export default class BuildListDependencies extends Command {
  static description = 'list of artifacts that are dependencies'

  static flags = Object.assign({}, artifactTypeFlag, configFlags, helpFlag)

  // should print
  // artifactRepoKey <tab> artifactName <tab> artifactVersion
  async run() {
    const {flags} = this.parse(BuildListDependencies)
    const {global, build} = await parseConfigAsync(flags.globalConfig, flags.repoConfig)

    this.log(build.name)
    this.log(global.environmentMap?.get('test'))
    this.log(`artifactType: ${flags.artifactType}`)
  }
}
