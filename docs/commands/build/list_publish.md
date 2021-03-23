---
layout: default
title: List Publish
parent: Build
grand_parent: Commands
nav_order: 2
---

# Build List Publish

list of artifacts that should be published

```
USAGE
  $ dhl build:list-publish

OPTIONS
  -c, --repoConfig=repoConfig       (required) repo config json or yaml file
  -g, --globalConfig=globalConfig   (required) global config json or yaml file
  -h, --help                        show CLI help
  -o, --outputType=table|json|yaml  [default: json] output format
  --artifactName=artifactName       artifact name
  --artifactType=artifactType       artifact type
  --event=event                     event
  --gitRemote=gitRemote             git remote name
  --gitRemoteRef=gitRemoteRef       git remote ref
  --outputPrefix=outputPrefix       prepend keys to output object
  --tag=tag                         tag always applied
  --tagTip=tagTip                   tag only applied if this is the branch tip
  --versionPrefix=versionPrefix     [default: build-] version prefix
```

_See code: [src/commands/build/list-publish.ts](https://github.com/boxboat/dockhand-lite/blob/master/src/commands/build/list-publish.ts)_