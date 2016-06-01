#!/bin/bash

echo starting pong-proxy server...
docker build -t pong-proxy .
docker kill pong-proxy
docker rm pong-proxy
docker run --name pong-proxy -p 80:80 -v `pwd`/nginx.conf:/etc/nginx/nginx.conf:ro -v `pwd`/static/:/usr/share/nginx/html:ro -v /tmp/flaeder:/tmp/flaeder:rw -d pong-proxy
docker inspect pong-proxy | grep -i \"IPAddress\":
