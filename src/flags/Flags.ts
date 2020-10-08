import {flags} from '@oclif/command'

export const artifactNameOptionalFlag = {
  artifactName: flags.string({
    name: 'artifactName',
    description: 'artifact name',
    env: 'DHL_ARTIFACT_NAME',
  }),
}

export const artifactTypeOptionalFlag = {
  artifactType: flags.string({
    name: 'artifactType',
    description: 'artifact type',
    env: 'DHL_ARTIFACT_TYPE',
  }),
}

export const eventOptionalFlag = {
  event: flags.string({
    name: 'event',
    description: 'event',
    env: 'DHL_EVENT',
  }),
}

export const eventRequiredFlag = {
  event: {
    ...eventOptionalFlag.event,
    required: true,
  },
}

export const globalFlags = {
  help: flags.help({
    char: 'h',
  }),
  globalConfig: flags.string({
    char: 'g',
    description: 'global config json or yaml file',
    env: 'DHL_GLOBAL_CONFIG',
    required: true,
    multiple: true,
    singleValue: true,
  }),
  repoConfig: flags.string({
    char: 'c',
    description: 'repo config json or yaml file',
    env: 'DHL_REPO_CONFIG',
    required: true,
    multiple: true,
    singleValue: true,
  }),
  outputType: flags.string({
    char: 'o',
    name: 'outputType',
    description: 'output format',
    env: 'DHL_OUTPUT_FORMAT',
    default: 'json',
    options: ['table', 'json', 'yaml'],
  }),
}

