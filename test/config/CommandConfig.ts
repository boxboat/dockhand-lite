import path from 'path'

export const configArgs = [
  '-g',
  path.join(__dirname, 'data', 'command', 'global.yaml'),
  '-c',
  path.join(__dirname, 'data', 'command', 'repo.yaml'),
]
