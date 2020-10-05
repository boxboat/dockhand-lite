FROM node:12-alpine AS build

RUN mkdir /dhl \
    && chown node:node /dhl

USER node:node
WORKDIR /dhl

COPY --chown=node:node package.json /dhl/package.json
COPY --chown=node:node yarn.lock /dhl/yarn.lock

RUN yarn install

COPY --chown=node:node . /dhl/

RUN yarn pack \
    && yarn install --production \
    && tar -xzf dockhand-lite-*.tgz \
    && mv node_modules package

FROM node:12-alpine

RUN apk add --no-cache \
        curl \
        git \
    && mkdir /workspace \
    && chown node:node /workspace

ENV NODE_ENV=production
USER node:node
ENTRYPOINT ["/dhl/bin/run"]
WORKDIR /workspace

COPY --from=build --chown=node:node /dhl/package /dhl
