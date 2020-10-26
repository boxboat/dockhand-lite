# build image
FROM node:12-alpine AS build

RUN apk add --no-cache \
        git \
    && mkdir /opt/dhl \
    && chown node:node /opt/dhl

USER node:node
WORKDIR /opt/dhl

COPY --chown=node:node package.json /opt/dhl/package.json
COPY --chown=node:node yarn.lock /opt/dhl/yarn.lock

RUN yarn install

COPY --chown=node:node . /opt/dhl

RUN yarn pack \
    && yarn install --production \
    && tar -xzf dockhand-lite-*.tgz \
    && mv node_modules package

# final image
FROM node:12-alpine

RUN apk add --no-cache \
        curl \
        git \
        jq \
        openssh-client \
    && mkdir /workspace \
    && chown node:node /workspace \
    && USER=node \
    && GROUP=node \
    && curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5/fixuid-0.5-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - \
    && chown root:root /usr/local/bin/fixuid \
    && chmod 4755 /usr/local/bin/fixuid \
    && mkdir -p /etc/fixuid \
    && printf "user: $USER\ngroup: $GROUP" > /etc/fixuid/config.yml

COPY --from=build --chown=node:node /opt/dhl/package /opt/dhl

RUN ln -s /opt/dhl/bin/run /usr/local/bin/dhl

ENV NODE_ENV=production
USER node:node
ENTRYPOINT ["fixuid", "-q"]
WORKDIR /workspace
