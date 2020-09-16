FROM node:12-alpine AS build

RUN mkdir /dockhand-lite \
    && chown node:node /dockhand-lite

USER node:node
WORKDIR /dockhand-lite

COPY --chown=node:node package.json /dockhand-lite/package.json
COPY --chown=node:node yarn.lock /dockhand-lite/yarn.lock

RUN yarn install

COPY --chown=node:node . /dockhand-lite/

RUN yarn pack \
    && yarn install --production \
    && tar -xzf dockhand-lite-*.tgz \
    && mv node_modules package

FROM node:12-alpine

RUN apk add --no-cache \
        curl \
        git \
    && USER=node \
    && GROUP=node \
    && curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5/fixuid-0.5-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - \
    && chown root:root /usr/local/bin/fixuid \
    && chmod 4755 /usr/local/bin/fixuid \
    && mkdir -p /etc/fixuid \
    && printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

ENV NODE_ENV=production
USER node:node
ENTRYPOINT ["/dockhand-lite/bin/run"]

COPY --from=build --chown=node:node /dockhand-lite/package /dockhand-lite
