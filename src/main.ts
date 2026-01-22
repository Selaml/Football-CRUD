import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LoggerService } from './core/middlewares/logger.middleware';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.enableVersioning({ type: VersioningType.URI });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const loggerService = app.get(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );


  app.use(helmet());
  app.enableCors();
  setupSwagger(app);
  app.use(cookieParser());

  const port = configService.get<number>('app.port') || 5000;
  await app.listen(port);
}
bootstrap();
