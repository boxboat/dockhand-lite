---
layout: default
title: Global
parent: Configuration
grand_parent: Documentation
nav_order: 1
---

# Gobal Configuration

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

# Schema for Global Dockhand Config

The following table lists all the parameters you can set in your dockhand repo config yaml file.

| Parameter                                | Description                                             |
|------------------------------------------|---------------------------------------------------------|
| `artifactRepoMap.[]<ARTIFACT_REPO_NAME>.<host:<HOSTNAME>>`                   | The artifact repo map gives dockhand the hostname of each artifact repo you're using. |                            
| `buildVersions.gitRepo.gitConnectionKey`       | Specifies what git connection you want to use from the gitConnectionMap for build versions repo. |
| `buildVersions.gitRepo.path`   | The path in your git repository to build versions       | 
| `buildVersions.gitRepo.ref`    |                             | 
| `environmentMap.[]<ENVIRONMENT_NAME>.{}<String,String>`       |  Define environments and key value pairs associated with those environments.  | 
| `gitConnectionMap.<REPO>.authorEmail`      | Email associated with the git connection.  | 
| `gitConnectionMap.<REPO>.authorName`     | Author of git connection (associated with commits for new build-versions)    | 
| `gitConnectionMap.<REPO>.remotePathPrefix`     | Path prefix to append to all git repos being used with the connection        | 
| `gitConnectionMap.<REPO>.remoteHost`    | The hostname of the remote git repository           | 
| `gitConnectionMap.<REPO>.remotePasswordEnvVar`   | Env var of password to use when dockhand interacts with remote repo      |
| `gitConnectionMap.<REPO>.remoteProtocol`     | Protocol to use interfacing with repo (https or ssh)   | 
| `gitConnectionMap.<REPO>.remoteUser`   | The remote user for dockhand to use when interacting with the git repo          | 
| `gitConnectionMap.<REPO>.sshKeyFile`   | Path to the ssh private key for dockhand to use interating with git     | 
| `gitConnectionMap.<REPO>.sshKeyFileEnvVar`      | Env var containing private key for dockhand to use interacting with the git repository   |