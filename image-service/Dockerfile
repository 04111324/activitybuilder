FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y curl
EXPOSE 3003
CMD ["node", "src/app.js"]