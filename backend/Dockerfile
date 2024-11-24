FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy --schema=./prisma/schema.prisma && HOSTNAME=${HOSTNAME:-0.0.0.0} node dist/index.js"]
