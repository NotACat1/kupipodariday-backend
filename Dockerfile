FROM node:18

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем код
COPY . .

# Установка PM2 глобально
RUN npm install -g pm2

# Сборка
RUN npm run build

# Экспорт порта из .env
ENV PORT=$PORT_BACKEND
EXPOSE $PORT

CMD ["pm2-runtime", "ecosystem.config.js"]
