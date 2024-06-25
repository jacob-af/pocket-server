import * as compression from 'compression';

import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { StripeRawBodyMiddleware } from './middleware/stripe-raw-body.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(compression());
  app.enableShutdownHooks();
  app.use('/webhooks/stripe', StripeRawBodyMiddleware);
  app.useBodyParser('json', { limit: '10mb' });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
