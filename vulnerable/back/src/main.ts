import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configurationConfig from './config/configuration.config';
import { ValidationError, useContainer } from 'class-validator';
import { BadRequestException, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { buildErrors } from './common/helpers/validation-error.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService(configurationConfig());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = configService.get('port') || 3100;
  const APP_ROUTE_PREFIX = 'api';

  app
    .setGlobalPrefix(APP_ROUTE_PREFIX)
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new BadRequestException(buildErrors(validationErrors), 'Validation Error');
        },
      }),
    )
    .enableCors();

  const config = new DocumentBuilder()
    .setTitle('Secu-web vulnerable Service')
    .setDescription(
      [
        'Secu-web vulnerable',
        'Get an Openapi export in:',
        `- [JSON format](/${APP_ROUTE_PREFIX}-docs-json)`,
        `- [YAML format](/${APP_ROUTE_PREFIX}-docs-yaml)`,
      ].join('\n\n'),
    )
    .setVersion(configService.get('image_tag') || 'Set IMAGE_TAG env var')
    .addBearerAuth({ type: 'http', name: 'access_token', description: 'Set access token' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${APP_ROUTE_PREFIX}-docs`, app, document, {
    customSiteTitle: 'Secu-web vulnerable API',
    customCss: '.topbar-wrapper img {content: url("/api/favicon.png");}',
    customfavIcon: '/api/favicon.png',
  });

  await app.listen(PORT);

  Logger.log(`🚀 Secu-web vulnerable is running on: http://localhost:${PORT}/${APP_ROUTE_PREFIX}`);
}
bootstrap();
