FROM node:10-alpine
RUN apk --no-cache add ca-certificates

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ttf-freefont \
    wqy-zenhei@edge

ENV SOURCE_DIR /crapdf
RUN mkdir -p ${SOURCE_DIR}
WORKDIR ${SOURCE_DIR}
COPY public public
COPY server server
COPY src src
COPY package.json .

# Build the CRA website
RUN yarn install && \
    yarn build

RUN yarn --cwd ./server install && \
    yarn --cwd ./server build
    
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# Adding entrypoint to Kubernetes manifest
CMD ["node", "server/build/index"]