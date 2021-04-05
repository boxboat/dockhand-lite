---
layout: default
title: How it Works
nav_order: 1
parent: Documentation
---

# How it Works

Dockhand Lite relies on certain configurations specified in yaml manifest files to actually function. There are two seperate configuration files Dockhand Lite needs to function. First off there is the dockhand lite global configuration file. You can either specify the path of this file in your dhl commands or set the environment variable `DHL_GLOBAL_CONFIG`. This config file eseentially contains the data dockhand needs to connect to your git repository containing build version. To find more specific info on the dockhand-lite go to this page in the docs. The second config file dockhand needs is the dockhand lite repo configuration file. You can either specify the path of this file in your dhl commands or set the environment variable `DHL_REPO_CONFIG`. This config contains data related to the actual app you are working with such as events you want dockhand to record a build, promotion or deploy off. For more information on DHL repo config files go to this page.

Once your configuration is set up Dockhand Lites functionality is actually implemented through shell commands called by the user or idealy CI/CD pipelines. In order to take full advantage of Dockhand lite these commands need to be called during three stages in your software supply chain. First off the build stage. Particularly when you are actually publishing the built artifacts. First off if the event that kicked off your build is also in your dockhand repo config calling dockhand `build:list-publish` can give you the immutable info from that commit to tag the artifact with to make sure you are doing a deterministic deployment later when you deploy that artifact. It will also provide a list of other tags that the published artifact will need such as the latest tag if it is the latest build. After the actual publish of the artifact though you will need to call `build:complete-publish` in order to give dockhand the information that it needs later when giving you information on what artifacts to actually promote or deploy.

The second stage in the supply chain dockhand must be called upon is the promote stage. Here dockhand is capable of supplying the needed data for the soon to be promoted artifact using `promote:list-publish`. You just need to simply supply it with the version of the artifact you want to promote. After you do promote it make sure to call `promote:complete-publish` this will ensure dockhand lite know which version was promoted most recently in order to use dockhand for the deployment information later.

The final stage dockhand is used in the software supply chain is the deployment stage. Dockhand can only be used once in this stage to retrieve the infromation on the artifact to be published using the `deploy:list-dependencies`. If your artifact had any other dependencies to be deployed with it it will also print the correct version for those accordingly.

With Dockhand you also have the capabilities of providing overrides. To do this you simply add overrides info in the dockhand config file. So if you want to temporarily promote based on commits to a certain feature branch you would simple add the event to an overrides section in the promote section on your dhl config file.

 



