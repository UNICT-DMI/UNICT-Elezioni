# not alpine: node-sass 8 has no prebuilt binary for Node 24 and builds from source, which needs python and g++
FROM node:24.22.1

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# webpack 4 (react-scripts 4) needs the legacy OpenSSL provider on Node 17+
ENV NODE_OPTIONS=--openssl-legacy-provider

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

ENTRYPOINT ["npm", "start"]