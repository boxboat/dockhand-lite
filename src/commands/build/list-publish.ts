import {Command, flags} from '@oclif/command'

export default class BuildShouldPush extends Command {
  static description = 'list of artifacts that should be published'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'artifactType', required: true, description: 'artifact type'},
  ]

  // should print
  // artifactRepoKey <tab> artifactName <tab> artifactVersion
  async run() {
    const {args, flags} = this.parse(BuildShouldPush)

    this.log(`artifactType: ${args.artifactType}`)
  }
}
