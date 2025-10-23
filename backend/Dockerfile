FROM node:22-alpine

WORKDIR /usr/src/app

# Instalar dependências do Puppeteer/Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Copiar pacotes e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o código
COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=development
EXPOSE 4000

CMD ["npm", "run", "dev"]
