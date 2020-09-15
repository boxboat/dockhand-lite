FROM node:12-alpine AS build

RUN mkdir /dockhand-lite \
    && chown node:node /dockhand-lite

USER node:node
WORKDIR /dockhand-lite

COPY --chown=node:node package.json /dockhand-lite/package.json
COPY --chown=node:node yarn.lock /dockhand-lite/yarn.lock

RUN yarn install

COPY --chown=node:node . /dockhand-lite/

RUN yarn run build \
    && yarn install --production


FROM node:12-alpine

RUN apk add --no-cache \
        git \
    && mkdir /dockhand-lite \
    && chown node:node /dockhand-lite

ENV NODE_ENV=production
USER node:node
WORKDIR /dockhand-lite/dist
ENTRYPOINT ["node", "index.js"]

COPY --from=build --chown=node:node /dockhand-lite/dist /dockhand-lite/dist
COPY --from=build --chown=node:node /dockhand-lite/node_modules /dockhand-lite/node_modules
