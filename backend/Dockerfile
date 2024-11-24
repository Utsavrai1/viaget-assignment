FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["sh", "-c", "npx prisma generate && HOSTNAME=${HOSTNAME:-0.0.0.0} node dist/index.js"]
