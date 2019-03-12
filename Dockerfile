FROM node:8-jessie
RUN apt update
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
CMD npm start && sleep infinity
