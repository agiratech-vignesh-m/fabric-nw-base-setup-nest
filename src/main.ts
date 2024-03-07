import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  const port = config.get<number>('port')
  // Setting the global prefix as api
  app.setGlobalPrefix('api');

  // Setting the API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  // Validator
  // Used to validate the request body
  app.useGlobalPipes(new ValidationPipe());

  // Cors
  app.enableCors();

  // Static public folder
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/api/static',
  });

  await app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  }).catch(error => {
    console.error(`Error connecting to server: ${error}`);
  });
}
bootstrap();
