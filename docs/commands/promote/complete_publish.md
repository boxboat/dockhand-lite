---
layout: default
title: Complete Publish
parent: Promote
grand_parent: Commands
nav_order: 2
---

# Promote Complete Publish

save new versions of published artifacts

```
USAGE
  $ dhl promote:complete-publish

OPTIONS
  -c, --repoConfig=repoConfig            (required) repo config json or yaml file
  -g, --globalConfig=globalConfig        (required) global config json or yaml file
  -h, --help                             show CLI help
  -o, --outputType=table|json|yaml       [default: json] output format
  --artifactName=artifactName            artifact name
  --artifactType=artifactType            artifact type
  --event=event                          event
  --gitConnectionKey=gitConnectionKey    git connection key
  --gitConnectionPath=gitConnectionPath  git connection path
  --outputPrefix=outputPrefix            prepend keys to output object
  --promotion=promotion                  (required) promotion
  --tag=tag                              tag always applied
  --tagTip=tagTip                        tag only applied if this is the branch tip
  --version=version                      version
```

_See code: [src/commands/promote/complete-publish.ts](https://github.com/boxboat/dockhand-lite/blob/master/src/commands/promote/complete-publish.ts)_