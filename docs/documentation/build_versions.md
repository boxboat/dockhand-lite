---
layout: default
title: Build Versions
nav_order: 1
parent: Documentation
---

# Build Versions

Dockhand Lite alleviates the burden of having to manage what version of a service should be deployed to an environment. It accomplishes this by maintaining a `build-versions` Git repository that stores build information about each service.

When a service is sucessfully built and published to a repository, dhl will update the `build-versions` Git repository appropriately to track the image tag that was pushed.

When a service is to be deployed to an environment, dhl will retrieve the appropriate image tag from the `build-versions` Git repository.

