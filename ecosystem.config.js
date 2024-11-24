module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js",
      env: {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        POSTGRES_DB: process.env.POSTGRES_DB,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        BACKEND_PORT: process.env.BACKEND_PORT,
      },
    },
  ],
};
