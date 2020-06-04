FROM node:10

RUN mkdir -p /usr/src/app/publisher

WORKDIR /usr/src/app/publisher

COPY package.json /usr/src/app/publisher

RUN npm install

COPY . /usr/src/app/publisher

CMD ["npm", "start"]