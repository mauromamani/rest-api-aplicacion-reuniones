FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY ./ ./

ENV PORT=3000
ENV SECRET_JWT_SEED=123
ENV MONGO_URI=

RUN npm install

CMD ["node", "index.js"]
