import {Command, flags} from '@oclif/command'

export default class BuildShouldPull extends Command {
  static description = 'list of artifacts that are dependencies'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'artifactType', required: true, description: 'artifact type'},
  ]

  // should print
  // artifactRepoKey <tab> artifactName <tab> artifactVersion
  async run() {
    const {args, flags} = this.parse(BuildShouldPull)

    this.log(`artifactType: ${args.artifactType}`)
  }
}
