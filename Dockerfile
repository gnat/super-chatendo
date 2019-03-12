FROM node:8-jessie
RUN apt update
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install
CMD npm start && sleep infinity
