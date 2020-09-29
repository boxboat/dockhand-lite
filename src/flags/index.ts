import {flags} from '@oclif/command'

export const artifactTypeFlag = {
  artifactType: flags.string({
    char: 't',
    name: 'artifactType',
    description: 'artifact type',
    env: 'DHL_ARTIFACT_TYPE',
  }),
}

export const helpFlag = {
  help: flags.help({
    char: 'h',
  }),
}

export const configFlags = {
  globalConfig: flags.string({
    char: 'g',
    description: 'global config json or yaml file',
    env: 'DHL_GLOBAL_CONFIG',
    required: true,
  }),
  repoConfig: flags.string({
    char: 'c',
    description: 'repo config json or yaml file',
    env: 'DHL_REPO_CONFIG',
    required: true,
  }),
}
