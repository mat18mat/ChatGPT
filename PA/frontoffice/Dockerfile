FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]