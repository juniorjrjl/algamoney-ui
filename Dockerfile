FROM node:18.12.0

RUN apt-get update && apt-get install -qq -y --no-install-recommends

ENV INSTALL_PATH /algamoney-ui

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package*.json ./

RUN npm i -g @angular/cli@14.2.8 --save-dev

RUN npm i

COPY . .