FROM node:18.12.1-alpine3.12

COPY . /app
WORKDIR /app
RUN npm install
CMD ["/usr/local/bin/npm", "start"]
EXPOSE 5000
