FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm install -g pm2

COPY . .

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["pm2-runtime", "ecosystem.config.cjs"]
