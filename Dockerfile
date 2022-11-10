FROM node:17.9.1-alpine3.12

COPY . /app
WORKDIR /app
RUN npm install
CMD ["/usr/local/bin/npm", "start"]
EXPOSE 5000
