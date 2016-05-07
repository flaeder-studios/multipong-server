FROM nginx

ADD nginx.conf /etc/nginx/nginx.conf
ADD start.sh /bin/start.sh
ADD static /usr/share/nginx/html/
