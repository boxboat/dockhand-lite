---
layout: default
title: Environment
parent: Deploy
grand_parent: Commands
nav_order: 1
---

# Deploy Environment

list of artifacts that are dependencies

```
USAGE
  $ dhl deploy:environment

OPTIONS
  -c, --repoConfig=repoConfig       (required) repo config json or yaml file
  -g, --globalConfig=globalConfig   (required) global config json or yaml file
  -h, --help                        show CLI help
  -o, --outputType=table|json|yaml  [default: json] output format
  --deployment=deployment           (required) deployment
  --outputPrefix=outputPrefix       prepend keys to output object
```

_See code: [src/commands/deploy/environment.ts](https://github.com/boxboat/dockhand-lite/blob/master/src/commands/deploy/environment.ts)_