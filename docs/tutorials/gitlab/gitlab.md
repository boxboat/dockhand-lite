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

For best practice you should also set the image to not run as root user and instead use the node user.

## Create Build Versions Repo

The build version repo will also be needed to allow dockhand lite to keep track of your artifacts. You can name the repo however you like just specify the path to it in your org correctly. Once its created just configure it in the global config in your base image under ```buildVersions```. We will do this in the next step. Example repo is [here](https://gitlab.com/boxboat/dockhand/dhl-tutorial/build-versions).

## Create Global Configuration File

The global config should have all the git connection info it needs and definitions of the different environments you might deploy to as well as artifact repositories you are using. It is also convenient to bake this config file into your dockhand lite base image so it always has the global configurations whereever you are using dockhand lite. You can also add a default repo config file in the image. The example dockhand lite image repo has these [set](https://gitlab.com/boxboat/dockhand/dhl-tutorial/base-images/dockhand-lite/-/tree/master/config).

## Deploy Key for Dockhand-Lite

```bash
$ ssh-keygen -t ed25519 -C "dhl demo deploy key"
```

Add private key to group environment variable DOCKHAND_LITE_DEMO_DEPLOY_KEY. You must also add this as a deploy key at the group level for your organization in Gitlab and give it write permissions.

## Create Deployment Repo

Deployment repo contains the needed resources to deploy your system of microservices. This could be a helm chart, kustomize manifests, or just a set of regular kubernetes manifests. For our example [here](https://gitlab.com/boxboat/dockhand/dhl-tutorial/deployment), we used a helm chart. You should also create a ```dockhand.yaml``` file here for the deployment repo configs. You can get an idea from our example deployment repo's file.

## Gitlab-CI templates with Dockhand-Lite

The gitlab-ci templates are where you actually get to put dockland-lite to action. To begin it is best to make a templated job with dockhand-lite base image and a source of all the scripts you might use in your future jobs. This snippet show an example with a before_script sourcing our script we will use in our ci jobs, it can be found [here](https://gitlab.com/boxboat/dockhand/dhl-tutorial/base-images/dockhand-lite/-/tree/master/scripts).

```yaml
# Have the following variables set as well
variables:
  DHL_GLOBAL_CONFIG: "/etc/dhl/global.yaml"
  DHL_REPO_CONFIG: "/etc/dhl/repo.yaml"
  DHL_DEPLOYMENT_REPO_CLONE_PATH: "/tmp/deployment"

.dhl:
  image: dockhand-lite:commit-master
  before_script:
  - |
    source /etc/dhl/scripts

```
This template can then be imported into your other ci files as a gitlab base job.

Along with this base job you will need one with capabilities of running docker to build pull and push containers. 

```yaml 
.docker:
  extends: .dhl
  services:
    - name: harbor.boxops.dev.poker/dockerio/library/docker:19.03.15-dind
      alias: docker
      command:
        - --registry-mirror
        - https://cluster.ci-registry.boxops.dev.poker:8443
  variables:
    DOCKER_BUILDKIT: "1"
    DOCKER_HOST: tcp://docker:2376
    DOCKER_TLS_CERTDIR: /certs
    DOCKER_TLS_VERIFY: "1"
    DOCKER_CERT_PATH: $DOCKER_TLS_CERTDIR/client
```

This is how we configure our base gitlab job to do so. You can optionally mirror a registry as well to cache your images.

## CI Stages 

With the two base gitlab ci jobs above you have what you need to start working on the ci jobs. You may organize the stages into files however you like but we simply put them into one gitlab-ci template file build.yaml. The four stages needed are a build stage, publish, test, and promote. Essentially all the stages prequal to the deploy. 

We will delve into those four here.

### build

The build job is pretty simple just run docker within docker and simply run docker build then push to a local registry. We simplify this and take advantage of caching using [Moby](https://mobyproject.org/). The stage just consists of running the moby docker image inside of the jobs container and executing the docker command within it. Keep in mind the possibility of a possible artifact strictly for testing with all the needed dependencies to test with. 

```yaml
build:
  extends: .dind
  stage: build
  script:
  - |
    docker run \
        --rm \
        --privileged \
        -v "$(pwd):/tmp/work" \
        --entrypoint buildctl-daemonless.sh \
        moby/buildkit:v0.8.2 \
          build \
          --frontend dockerfile.v0 \
          --local "context=/tmp/work" \
          --local "dockerfile=$(dirname /tmp/work/Dockerfile)" \
          --opt build-arg:user=$DOCKER_USER \
          --output "type=image,name=$RELEASE_IMAGE,push=false"
  - |
    if [ -n "$DOCKER_TARGET_TEST" ] && [ "$SKIP_TESTS" = "false" ]; then
      docker run \
        --rm \
        --privileged \
        -v "$(pwd):/tmp/work" \
        --entrypoint buildctl-daemonless.sh \
        moby/buildkit:v0.8.2 \
          build \
          --frontend dockerfile.v0 \
          --local "context=/tmp/work" \
          --local "dockerfile=$(dirname /tmp/work/Dockerfile)" \
          --opt build-arg:user=$DOCKER_USER \
          --opt target=$DOCKER_TARGET_TEST \
          --output "type=image,name=$TEST_IMAGE,push=false"
    fi
```

### publish

The publish stage is where you push these images to your official container repository. Dockhand comes really gets put to use here as it provides you with all the correct image names to push. It provides a unique version of the image using the commit SHA from the apps commit that triggered the pipeline.

```yaml
publish:
  extends: .dind
  stage: publish
  script:
    - |
      # If no dockhand build configuration is in the repo then generate a default one
      cat <<EOT >> "/tmp/dockhand.yaml"
      build:
        artifacts:
          docker:
            - $IMAGE_PATH
      EOT
      add_dockhand_repo_file "/tmp/dockhand.yaml"
      add_dockhand_repo_file "dockhand.yaml"

      tag_tip="commit-$CI_COMMIT_REF_SLUG"

      # list_publish contains artifacts that should be published
      # In this case it publishes an image tagged with tag_tip and it will also push the artifact with the latest tag
      # With the dockhand repo config file dockhand will produce the needed data to publish the image such as the artifact(docker image) tags to publish as well as the repo host and name of the artifacts.
      list_publish="$(dhl \
        build:list-publish \
        --event "commit/$CI_COMMIT_BRANCH" \
        --tagTip "$tag_tip")"

      # This loop actually publishes all the artifacts listed by dockhand to publish
      num_publish="$(echo "$list_publish" | jq -r '. | length')"
      if [ "$num_publish" -gt "0" ]; then
        docker login -u "$REGISTRY_USERNAME" -p "$REGISTRY_PASSWORD" "$REGISTRY_HOST"
        docker pull "$RELEASE_IMAGE"

        for i in $(seq 0 "$(expr "$num_publish" - 1)"); do
          artifact="$(echo "$list_publish" | jq -r ".[$i]")"
          image_to_publish="$(echo "$artifact" | jq -r '.repo.host + "/" + .name + ":" + .version')"
          docker tag "$RELEASE_IMAGE" "$image_to_publish"
          docker push "$image_to_publish"
        done

        dhl \
          build:complete-publish \
          --event "commit/$CI_COMMIT_BRANCH" \
          --tagTip "$tag_tip" \
          -o table
      else
        echo "No images to publish"
      fi
```

### Promote

The promote stage in our case is a commit to master. Dockhand lite will actually then tag this commit to master. You could simply make just take the commit to master the promoted artifact and not worry about tagging the commit but tagging allows rolling back releases easier. In premote Dockhand lite takes similar action in publish but rather it just retags those images with tags to identify the artifacts are release candidates.

```yaml 
.tag:
  stage: promote
  extends: .docker
  script:
    - |
      cat <<EOT >> "/tmp/dockhand.yaml"
      promote:
        artifacts:
          docker:
            - $IMAGE_PATH
      EOT
      add_dockhand_repo_file "/tmp/dockhand.yaml"

      add_dockhand_repo_file "dockhand.yaml"

      tag_tip="tag-$TAG_TYPE"
      build_data="$(dhl \
        promote:list-publish \
        --promotion "$PROMOTION" \
        --version "build-$(echo "$CI_COMMIT_SHA" | cut -c1-12)" \
        --tagTip "$tag_tip")"

      length="$(echo "$build_data" | jq -r '. | length')"
      if [ "$length" -gt "0" ]; then
        docker login -u "$HARBOR_USERNAME" -p "$HARBOR_PASSWORD" "$HARBOR_HOST"

        for i in $(seq 0 "$(expr "$length" - 1)"); do
          artifact="$(echo "$build_data" | jq -r ".[$i]")"
          image="$(echo "$artifact" | jq -r '.repo.host + "/" + .name + ":" + .version')"
          new_image="$(echo "$artifact" | jq -r '.repo.host + "/" + .name + ":" + .promoteToVersion')"
          docker pull "$image"
          docker tag "$image" "$new_image"
          docker push "$new_image"
        done

        dhl \
          promote:complete-publish \
          --promotion "$PROMOTION" \
          --version "build-$(echo "$CI_COMMIT_SHA" | cut -c1-12)" \
          --tagTip "$tag_tip"\
          -o table
      else
        echo "No images to publish"
        exit 1
      fi

      sync_multi_deployment_versions "$DEPLOYMENT_PROJECT_PATH" "$SYNC_DEPLOYMENTS"

tag-prod-release:
  extends: .tag
  variables:
    TAG_TYPE: release
    PROMOTION: prod
    SYNC_DEPLOYMENTS: prod
  rules:
    - if: $CI_COMMIT_BRANCH == "staging" || $CI_COMMIT_BRANCH =~ /^hotfix\//
      when: manual
```

Notice we make a base tag stage. This enables us to easily create stages for promotion to different environments. We could do and have a stage to promote from say a dev environment to a nonprod one. The key modifiers of the tag stage are the variables.