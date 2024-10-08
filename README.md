# КупиПодариДай

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

Проект **КупиПодариДай** реализует API для регистрации и авторизации пользователей, используя NestJS и PostgreSQL. Это приложение предоставляет функции для создания новых пользователей, входа в систему, получения данных о пользователях и управления их пожеланиями.

## Установка

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/NotACat1/kupipodariday-backend.git
   cd kupipodariday-backend
   ```

2. **Установите зависимости:**

   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**

   Переименуйте файл `.env.example` в `.env` и обновите его, указав свои настройки окружения.

   ```bash
   mv .env.example .env
   ```

   Пример файла `.env`:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password

   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=your_jwt_expiration

   BCRYPT_SALT_ROUNDS=your_bcrypt_salt_rounds

   PORT=3000
   ```

4. **Создайте базу данных PostgreSQL:**

Убедитесь, что PostgreSQL установлен и запущен. Создайте новую базу данных и обновите файл `.env` с вашими учетными данными.

5. **Запустите миграции базы данных:**

Если у вас настроены миграции, запустите их командой:

```bash
npm run migration:run
```

## Запуск проекта

1. **Запустите сервер разработки:**

   ```bash
   npm run start:dev
   ```

   Сервер будет запущен на `http://localhost:3000`.

2. **Сборка проекта:**

   Для запуска в режиме продакшн:

   ```bash
   npm run build
   npm run start:prod
   ```

## Скрипты npm

В проекте используются следующие скрипты:

- **`prepare`**: Устанавливает Husky для управления Git хуками.
- **`prebuild`**: Удаляет папку `dist` перед сборкой.
- **`build`**: Собирает проект с использованием команды `nest build`.
- **`format`**: Форматирует файлы TypeScript с помощью Prettier.
- **`start`**: Запускает проект.
- **`start:dev`**: Запускает проект в режиме разработки с автоматическим перезапуском при изменениях.
- **`start:debug`**: Запускает проект в режиме отладки.
- **`start:prod`**: Запускает скомпилированный проект в режиме продакшн.
- **`lint`**: Запускает ESLint для проверки и исправления кода.
- **`test`**: Запускает тесты с использованием Jest.
- **`test:watch`**: Запускает тесты в режиме слежения за изменениями.
- **`test:cov`**: Запускает тесты с генерацией отчета о покрытии кода.
- **`test:debug`**: Запускает тесты в режиме отладки.
- **`test:e2e`**: Запускает end-to-end тесты.
- **`typeorm`**: Команда для выполнения действий с TypeORM.
- **`migration:generate`**: Генерирует новую миграцию.
- **`migration:run`**: Выполняет миграции.
- **`migration:revert`**: Отменяет последнюю выполненную миграцию.

## API Endpoints

Документация со всеми доступными командами и маршрутами API доступна на [SwaggerHub](https://app.swaggerhub.com/apis/zlocate/KupiPodariDay/1.0.0/).
