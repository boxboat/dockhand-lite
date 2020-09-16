dockhand-lite
=============



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dockhand-lite.svg)](https://npmjs.org/package/dockhand-lite)
[![Downloads/week](https://img.shields.io/npm/dw/dockhand-lite.svg)](https://npmjs.org/package/dockhand-lite)
[![License](https://img.shields.io/npm/l/dockhand-lite.svg)](https://github.com/git@gitlab.com:boxboat/dockhand/gitlab-poc/dockhand-lite.git/blob/master/package.json)

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
* [`dockhand-lite hello [FILE]`](#dockhand-lite-hello-file)
* [`dockhand-lite help [COMMAND]`](#dockhand-lite-help-command)

## `dockhand-lite hello [FILE]`

describe the command here

```
USAGE
  $ dockhand-lite hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dockhand-lite hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://gitlab.com/boxboat/dockhand/gitlab-poc/dockhand-lite/blob/v0.0.1/src/commands/hello.ts)_

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
