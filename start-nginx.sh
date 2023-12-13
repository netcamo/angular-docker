#!/bin/sh
envsubst '$NGINX_PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
