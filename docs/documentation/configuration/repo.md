---
layout: default
title: Repo
parent: Configuration
grand_parent: Documentation
nav_order: 2
---

# Repo Configuration

Common, build, promote, and deploy configuration are specified in the repo configuration file.

Dockhand Lite reads repo configuration from the file path specified in the required environment variable `DHL_REPO_CONFIG`. Dockhand Lite repo configuration can be specified in JSON or YAML formats.

Multiple repo configuration files can be specified in the `DHL_REPO_CONFIG` using a `:` delimiter.

## [](#header-1) Common

Artifacts and Artifact Publish Events are specified in common repo configuration. Common configuration is shared amongst the Build, Promote, and Deploy stages.

Artifacts will be pushed to matching registries during the build stage, promoted during the promote stage and tags for the artifacts will be computed during the deploy stage.

## [](#header-1) Build

Artifact dependencies needed to build or test the target artifact can be specified in the Build Repo configuration.

## [](#header-1) Promote

Base Version, Tag Prefix, Promotion Map and Disable Tagging configurations can be specified in the Promote Repo configuration.

The Promotion mapping specifies and event that should happen and a promote event to perform for deployment environments.

## [](#header-1) Deploy

A Deployment Mapping must be specified in the Deploy Repo configuration. The mapping specifies what event triggers a deployment to an environment.

## [](#header-1) Config Explanations and Examples

### [](#header-1) Artifact Publish Events

Artifact Publish Events specify an artifact type, artifact repo key and an event or event regex. Artifacts of the specified type are retrieved from the specified artifact repo when an event occurs that matches the specified regex. Setting this enables dockhand to give you the correct hostname corresponding to the artifacts location according to the event that was last triggered related to that artifact.

This configuration can be specified in any of the four sections of the repo configuration. An example below defines docker and npm artifactPublishEvents.

```yaml
common:
  artifactPublishEvents:
    - artifactType: docker
      event: commit/master
      artifactRepoKey: default-docker-key
    - artifactType: npm
      event: commit/master
      artifactRepoKey: default-npm-key
```

### [](#header-1) Artifacts
 
Artifacts allow you to define one or more artifacts under a series of artifactTypes. An example of this would be the following.

```yaml
common:
  artifactPublishEvents:
    - artifactType: docker
      event: commit/master
      artifactRepoKey: default-docker-key
    - artifactType: npm
      event: commit/master
      artifactRepoKey: default-npm-key
  artifacts:
    docker:
      - image/a
      - image/b
    npm:
      - package/a
```

### [](#header-1) Events and Event Fallbacks

Dockhand uses events often in its configuration as a result of its event driven design to interact with git. Although event appears often in configuration under different sections its expected values are univesal across its use. Events can be commonly used to follow to triggers in git a commit or a tag. The below examples use both regex and non regex.

Event Regex Example:
```yaml
common:
  artifactPublishEvents:
    - artifactRepoKey: harbor
      artifactType: docker
      eventRegex: ^commit/(develop|staging|master|feature/.*|hotfix/.*)$
    - artifactRepoKey: harbor
      artifactType: docker
      eventRegex: ^tag/.*$
```

Event Example: 
```yaml
deploy:
  deploymentMap:
    stage:
      event: commit/staging
      environmentKey: nonprod
    prod:
      event: tag/release
      environmentKey: prod
```

### [](#header-1) PromotionMap

The promotion map in the config is where you should specify events to promote an artifact to a new environment. It generates what should be the new tag of the artifact for the environment it is promoted to. It applies to every artifact defined in common, promotion and the promotionMap artifact overrides section of your repo config. Below is an example of a promotionMap that will promote an artifact based on a commit to stage branch in git.

```yaml
common:
  artifactPublishEvents:
    - artifactType: docker
      eventRegex: ^commit/(develop|staging|master|feature/.*|hotfix/.*)$
      artifactRepoKey: default
  artifacts:
    docker:
      - "image/a"

promote:
  promotionMap:
    stage:
      event: commit/staging
      promoteToEvent: tag/rc
```

### [](#header-1) DeploymentMap

The deployment map in git is where you define the events in git that should trigger a deployment to a certain environment. The environmentKey variable allows you to map the environment to one defined in the global config specifying the name of the environment artifacts should be deployed to. The following shows an example of a stage and prod environment(Assume those are defined in global config).

```yaml
common:
  artifactPublishEvents:
    - artifactType: docker
      eventRegex: ^commit/(develop|staging|master|feature/.*|hotfix/.*)$
      artifactRepoKey: default
  artifacts:
    docker:
      - "image/a"

deploy:
  deploymentMap:
    stage:
      event: tag/rc
      environmentKey: nonprod
    prod:
      event: tag/release
      environmentKey: prod
```

### [](#header-1) Example

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
      artifactRepoKey: 

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

# Schema for Repo Dockhand Config

The Repo Schema API documentation can be found [here](https://github.com/boxboat/dockhand-lite/blob/master/docs/api/interfaces/repo_irepoconfig.irepoconfig.md).