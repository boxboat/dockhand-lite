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

export const deploymentRequiredFlag = {
  deployment: flags.string({
    name: 'deployment',
    description: 'deployment',
    env: 'DHL_DEPLOYMENT',
    required: true,
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

export const gitRemoteFlags = {
  gitRemote: flags.string({
    description: 'git remote name',
    env: 'DHL_GIT_REMOTE',
  }),
  gitRemoteRef: flags.string({
    description: 'git remote ref',
    env: 'DHL_GIT_REMOTE_REF',
  }),
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
  outputPrefix: flags.string({
    name: 'outputMap',
    description: 'prepend keys to output object',
    env: 'DHL_OUTPUT_PREFIX',
  }),
}

export const outputMapFlag = {
  outputMap: flags.boolean({
    name: 'outputMap',
    description: 'convert output from table to map',
    env: 'DHL_OUTPUT_MAP',
  }),
}

export const tagFlags = {
  tag: flags.string({
    description: 'tag always applied',
    env: 'DHL_TAG',
    multiple: true,
    singleValue: true,
  }),
  tagTip: flags.string({
    description: 'tag only applied if this is the branch tip',
    env: 'DHL_TAG_TIP',
    multiple: true,
    singleValue: true,
  }),
}

export const versionPrefixFlag = {
  versionPrefix: flags.string({
    name: 'versionPrefix',
    description: 'version prefix',
    env: 'DHL_VERSION_PREFIX',
    default: 'build-',
  }),
}
