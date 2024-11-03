import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import logger from '@config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const port = process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  logger.info(`Application is running on: http://localhost:${port}`);
}

bootstrap();
