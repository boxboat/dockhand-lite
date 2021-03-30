---
layout: default
title: Home
permalink: /
nav_order: 1
---

# Dockhand Lite

Dockhand Lite (dhl) is a CLI meant to be used by CI/CD pipelines to facilitate builing, promotiong, and deploying applications to Kubernetes clusters.


## Events

Events are directly connected with changes in git. An example would be a commit in the develop branch being identified as a commit/develop. These enable dockhand to look at git and determine what event it was specified to watch over in configuration went off. This is used when dockhand uses a list command associated with build, promotion, or deploy. So if you added the event commit/stage under an item in your promotionMap dockhand would look for the latest commit under that branch when calling list-dependencies and give it to with all the data associated with the artifact associated with that event.

## Repository Architecture

Dockhand is most useful with a specific repository architecture. This is a group of app repos ussually representing microservices and a deployment repo that deploys the system of microservices together. 

## Application Repositories

For application repos Dockhand can be used to maintain versions of each artifact produced from the applications code. It can also track promotions of those artifacts. Dockhands ability to check events in git lets it handle the process of getting the right versions of the artifact to promote. This eases your responsibilities in the software supply chain as you never have to worry about possibly rebuilding the artifact to be promoted or having to go and look for the existing artifact in your artifact repository as the versions are tracked by dockhand lite. Configuration that is ussually set for app repos is ussally build or promote related.

## Deploy Repositories

For the deployment repos dockhand is very ideal to have as a tool. Systems of microservices tend to be quite large so this makes managing deployments tough to actually implement. Without dockhand you would probably have to check to see if a new artifact was published for any of the services and if not, you are deploying the correct ones. This whole process though can actually just be offloaded to dockhand lite. All you have to do is identify the microservices you want dockhand to keep track of in your dockhand repo file. With this a single Dockhand Lite command can give you all the data of the appropriate artifacts to deploy for each microservice. Dockhand also has a feature enabling it to print all the artifacts data in a format native to helm making helm deployments seemless.