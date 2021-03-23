---
layout: default
title: Global
parent: Configuration
grand_parent: Documentation
nav_order: 1
---

Artifact repository configuration, build version git repository configuration, environment mapping configuration, and git connection configuration are specified in the global configuration file.

Dockhand Lite reads global configuration from the file path specified in the required environment variable `DHL_GLOBAL_CONFIG`. Dockhand Lite global configuration can be specified in JSON or YAML formats.

Multiple global configuration files can be specified in the `DHL_GLOBAL_CONFIG` using a `:` delimiter.

# [](#header-1) Example

```yaml
# Use Docker Hub as our default artifact repository
artifactRepoMap:
  default:
    host: index.docker.io

# Configure a GitLab git connection to https://gitlab.com/dockhand-lite-example using a Deploy Key
gitConnectionMap:
  gitLab:
    authorEmail: dockhand@example.com
    authorName: Dockhand Service Account
    remoteHost: gitlab.com
    remotePathPrefix: dockhand-lite-example
    remoteProtocol: ssh
    remoteUser: git
    sshKeyFileEnvVar: "DOCKHAND_LITE_DEPLOY_KEY"

# Use the `gitLab` git connection for the build-version git repo at https://gitlab.com/dockhand-lite-example/build-versions
buildVersions:
  gitRepo:
    gitConnectionKey: gitLab
    path: dockhand-lite-example/build-versions

# Create a mapping of environment names to Kubernetes cluster names
environmentMap:
  dev:
    cluster: dev1
  nonprod:
    cluster: nonprod1
  prod:
    cluster: prod1
```
