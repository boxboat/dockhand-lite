dockhand-lite
=============



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dockhand-lite.svg)](https://npmjs.org/package/dockhand-lite)
[![Downloads/week](https://img.shields.io/npm/dw/dockhand-lite.svg)](https://npmjs.org/package/dockhand-lite)
[![License](https://img.shields.io/npm/l/dockhand-lite.svg)](https://github.com/https://gitlab.com/boxboat/dockhand/gitlab-poc/dockhand-lite/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dockhand-lite
$ dockhand-lite COMMAND
running command...
$ dockhand-lite (-v|--version|version)
dockhand-lite/0.0.1 linux-x64 node-v12.18.4
$ dockhand-lite --help [COMMAND]
USAGE
  $ dockhand-lite COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dockhand-lite build:list-dependencies ARTIFACTTYPE`](#dockhand-lite-buildlist-dependencies-artifacttype)
* [`dockhand-lite build:list-publish ARTIFACTTYPE`](#dockhand-lite-buildlist-publish-artifacttype)
* [`dockhand-lite help [COMMAND]`](#dockhand-lite-help-command)

## `dockhand-lite build:list-dependencies ARTIFACTTYPE`

list of artifacts that are dependencies

```
USAGE
  $ dockhand-lite build:list-dependencies ARTIFACTTYPE

ARGUMENTS
  ARTIFACTTYPE  artifact type

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/build/list-dependencies.ts](https://gitlab.com/boxboat/dockhand/gitlab-poc/dockhand-lite/blob/v0.0.1/src/commands/build/list-dependencies.ts)_

## `dockhand-lite build:list-publish ARTIFACTTYPE`

list of artifacts that should be published

```
USAGE
  $ dockhand-lite build:list-publish ARTIFACTTYPE

ARGUMENTS
  ARTIFACTTYPE  artifact type

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/build/list-publish.ts](https://gitlab.com/boxboat/dockhand/gitlab-poc/dockhand-lite/blob/v0.0.1/src/commands/build/list-publish.ts)_

## `dockhand-lite help [COMMAND]`

display help for dockhand-lite

```
USAGE
  $ dockhand-lite help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
