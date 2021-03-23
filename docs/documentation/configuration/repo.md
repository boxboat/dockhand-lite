---
layout: default
title: Repo
parent: Configuration
grand_parent: Documentation
nav_order: 2
---

Common, build, promote, and deploy configuration are specified in the repo configuration file.

Dockhand Lite reads repo configuration from the file path specified in the required environment variable `DHL_REPO_CONFIG`. Dockhand Lite repo configuration can be specified in JSON or YAML formats.

Multiple repo configuration files can be specified in the `DHL_REPO_CONFIG` using a `:` delimiter.

# [](#header-1) Common

Artifacts and Artifact Publish Events are specified in common repo configuration. Common configuration is shared amongst the Build, Promote, and Deploy stages.

Artifacts will be pushed to matching registries during the build stage, promoted during the promote stage and tags for the artifacts will be computed during the deploy stage.

Artifact Publish Events specify an artifact type, artifact repo key and event regex. Artifacts of the specified type are retrieved from the specified artifact repo when an event occurs that matches the specified regex.

# [](#header-1) Build

Artifact dependencies needed to build or test the target artifact can be specified in the Build Repo configuration.

# [](#header-1) Promote

Base Version, Tag Prefix, Promotion Map and Disable Tagging configurations can be specified in the Promote Repo configuration.

The Promotion mapping specifies and event that should happen and a promote event to perform for deployment environments.

# [](#header-1) Deploy

A Deployment Mapping must be specified in the Deploy Repo configuration. The mapping specifies what event triggers a deployment to an environment.

# [](#header-1) Example

```yaml
common:
  artifactPublishEvents:
    - artifactType: docker
      event: commit/master
      artifactRepoKey: default
    - artifactType: docker
      event: commit/develop
      artifactRepoKey: default
    - artifactType: docker
      eventRegex: tag/.*
      artifactRepoKey: default

promote:
  promotionMap:
    stage:
      event: commit/master
      promoteToEvent: tag/rc
    prod:
      event: tag/rc
      promoteToEvent: tag/release

deploy:
  deploymentMap:
    dev:
      event: commit/master
      environmentKey: nonprod
    stage:
      event: tag/rc
      environmentKey: nonprod
    prod:
      event: tag/release
      environmentKey: prod

```