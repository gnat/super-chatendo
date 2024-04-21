# Super Chatendo Entertainment System

Live demo: http://superchatendo.com

Written by Nathaniel Sabanski.

Uses HTML5, CSS3, Node, Redis, Web Sockets (Socket.io), Express, jQuery.

## Screenshot

<img src="http://i.imgur.com/vwD7Xxd.png" alt="Super Chatendo Entertainment System" />

## Features

* Real time Twitch/Slack chat demo with lobby, emotes and colorful user sessions.
* Backend using Redis.

## 🍞 Run using Bun

Standalone using [Bun](https://github.com/oven-sh/bun). No npm or node!

* `sudo apt install redis wget`
* `git clone https://github.com/gnat/super-chatendo.git .`
* `cd super-chatendo`
* `wget https://github.com/oven-sh/bun/releases/download/bun-v1.1.4/bun-linux-x64.zip ; unzip -j ./bun-linux-x64.zip`
* `chmod +x ./bun`
* `./bun install`
* `./bun run index.js`

And point your browser to `http://localhost:3000`. Optionally, specify a port by supplying the `PORT` env variable.

## 🐋 Run using Docker

<a href="https://hub.docker.com/r/sabanski/super-chatendo" target="_blank"><img src="https://img.shields.io/docker/cloud/build/sabanski/super-chatendo.svg" alt="Super Chatendo Entertainment System" /></a>

Optionally run Super Chatendo in a container using Docker.

Fully automated setup using Docker Compose. Includes Redis and Nginx reverse proxy.

* `sudo docker-compose build && sudo docker-compose up --force-recreate --remove-orphans`

Or bare Node.js app only. You provide your own Redis server.

* `sudo docker build -t superchatendo --no-cache . && sudo docker run -p80:3000 -d superchatendo`
