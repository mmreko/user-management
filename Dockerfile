FROM node:8

WORKDIR /home/app/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]