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

# Schema for Repo Dockhand Config

The following table lists all the parameters you can set in your dockhand repo config yaml file.

| Parameter                                | Description                                             |
|------------------------------------------|---------------------------------------------------------|


| `common.artifactPublishEvents.artifactRepoKey`  | This is your artifact repo configured in the global dockhand config |
| `common.artifactPublishEvents.artifactType`  | This is the type of artifact you plan on having dockhand track | 
| `common.artifactPublishEvents.event`  | This is an event in git for dockhand to watch for. (ex. event commiting to deveop: `commit/develop`) | 
| `common.artifactPublishEvents.eventRegex`                   | This is an regular expression representing a set of events for dockhand to watch for |
| `common.[]<ARTIFACT_NAME>.{}<String,String>`                   | This represents artifacts you want dockhand to track for build promote and deploy | 
| `common.name`                   | The name of your common configuration |

| `build.artifactPublishEvents`   | The git events dockhand should use to identify when to publish the build artifact | 
| `build.[]<ARTIFACT_NAME>.{}<String,String>`  | This represents artifacts you want dockhand to track for build   |
| `build.dependencies.[]<ARTIFACT_NAME>.{}<String,String>`   | This represents artifacts of dependencies you want dockhand to track for build |
| `build.dependencies.event`   | The event dockhand should track for a build dependency  |
| `build.dependencies.eventFallback`   | If the main event for a dependency does not occur dockhand should look for this event for the dependency |
| `build.dependencies.ArtifactsResolverOverrides`(ASK CALEB)   | service type for Airflow UI   |
| `build.name`   | The name of the build section in your repo config |
| `promote.artifactPublishEvents`   | The git events dockhand should use to identify when to promote the artifact |
| `promote.[]<ARTIFACT_NAME>.{}<String,String>`   | This represents artifacts of dependencies you want dockhand to track for promotions |
| `promote.baseVersion`   | ? |
| `promote.gitTagDisable`   | ? |
| `promote.name`   | The name of your promote section config  |
| `promote.promotionMap.[]<ARTIFACT_NAME>.{}<String,String>`   | Map of artifacts to promote with event data specific to each artifact |
| `promote.promotionMap.[]<ARTIFACT_NAME>.event`   | Events for dockhand to watch for to know when to promote the artifact |
| `promote.promotionMap.[]<ARTIFACT_NAME>.eventFallback`   | If the main event for a artifact to be promoted does not occur dockhand should look for this event for the artifact   |
| `promote.promotionMap.[]<ARTIFACT_NAME>.eventFallback.overrides.[]<ARTIFACT_NAME>.{}<String,String>` | artifacts to override the artifact to be promoted with.  |
| `promote.promotionMap.[]<ARTIFACT_NAME>.eventFallback.overrides.event` | Event for dockhand to watch for the overriden artifact. |
| `promote.promotionMap.[]<ARTIFACT_NAME>.eventFallback.overrides.eventFallback` | If the main event for an override artifact to be promoted does not occur dockhand should look for this event for the artifact |
| `promote.tagPrefix`   |  |
| `deploy.artifactPublishEvents`   |   |
| `deploy.artifacts`   |   |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.[]<ARTIFACT_NAME>.{}<String,String>`   | Map of artifacts to promote with event data specific to each artifact. |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.environmentKey`  | Environment key of the artifact to deploy (identifier for cluster of that environment) |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.event`  |  Event for dockhand to follow to determine deploying a new release. |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.eventFallback`  |  If the main event for a dependency does not occur dockhand should look for this event for the dependency  |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.eventRegex`  |  Regular expression representing a set of events for dockhand to watch for for a deployment |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.group`  |    |
| `deploy.deploymentMap.[]<DEPLOYMENT_NAME>.overrides`  |  Overrides for a deployment.  |
| `deploy.name`   | The name of the deployment  |
| `deploy.overrides.[]<ARTIFACT_NAME>.{}<String,String>`   | service type for Airflow UI    |
| `deploy.overrides.event` | Event for dockhand to follow for the override artifacts |
| `deploy.overrides.event` | Fallback event for dockhand to follow for the override artifacts |

