---
layout: default
title: GitLab
nav_order: 1
parent: Tutorials
---

# Gitlab Tutorial

This tutorial will teach you how to use Dockhand Lite to manage build versions in Gitlab CI/CD pipelines.

## Create Custom Dockhand Lite Image

To build a boxboat dhl docker image you simply need to use the boxboat dhl image as the base image. Ex. Dockerfile

```
FROM boxboat/dockhand-lite:0.1.0 
```

You should also copy a base repo and global config into the image. The global config should have all the git connection info it needs and definitions of the different environments you might deploy to as well as artifact repositories you are using. Once you have that you can do whatever you like to the image. 

For best practice you should also set the image to not run as root user and instead use the node user.

## Create Build Versions Repo

The build version repo will also be needed to allow dockhand lite to keep track of your artifacts. You can name the repo however you like just specify the path to it in your org correctly. Once its created just configure it in the global config in your base image under ```buildVersions```

## Create a Deploy Key

```bash
$ ssh-keygen -t ed25519 -C "dhl demo deploy key"
```

Add private key to group environment variable

DOCKHAND_LITE_DEMO_DEPLOY_KEY

## Create Deployment Repo

Add Deploy Key
Enable write permissions

## Create Global Configuration File

