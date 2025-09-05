FROM --platform=linux/amd64 node:18-alpine AS build

WORKDIR /dist/src/app
COPY . .
RUN npm cache clean --force
RUN npm install
RUN npm run build --prod
#RUN npm run build