FROM node:10

RUN mkdir -p /usr/src/app/consumer

WORKDIR /usr/src/app/consumer

COPY package.json /usr/src/app/consumer

RUN npm install

COPY . /usr/src/app/consumer

EXPOSE 2000

CMD ["npm", "start"]