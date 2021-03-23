---
layout: default
title: List Dependencies
parent: Deploy
grand_parent: Commands
nav_order: 2
---

# Deploy List Dependencies

list of artifacts that are dependencies

```
USAGE
  $ dhl deploy:list-dependencies

OPTIONS
  -c, --repoConfig=repoConfig       (required) repo config json or yaml file
  -g, --globalConfig=globalConfig   (required) global config json or yaml file
  -h, --help                        show CLI help
  -o, --outputType=table|json|yaml  [default: json] output format
  --artifactName=artifactName       artifact name
  --artifactType=artifactType       artifact type
  --deployment=deployment           (required) deployment
  --outputMap                       convert output from table to map
  --outputPrefix=outputPrefix       prepend keys to output object
```

_See code: [src/commands/deploy/list-dependencies.ts](https://github.com/boxboat/dockhand-lite/blob/master/src/commands/deploy/list-dependencies.ts)_