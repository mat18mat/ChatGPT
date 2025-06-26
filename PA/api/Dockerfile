FROM node:18-alpine

RUN apk add --no-cache python3 make g++ wget

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --production --build-from-source \
  && apk del python3 make g++

COPY . .
RUN chmod +x wait-for-db.sh

EXPOSE 4000
CMD ["/bin/sh", "./wait-for-db.sh"]