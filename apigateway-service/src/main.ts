import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpLogger, AllExceptionsFilter } from './middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  app.setGlobalPrefix('/api/v1');

  const swaggerBaseUrl = configService.get<string>('SWAGGER_BASE_URL');

  const config = new DocumentBuilder()
    .setTitle('Gradell Service')
    .setDescription('API documentation for the Gradell microservice')
    .setVersion('1.0')
    .addBearerAuth() // If you're using JWT
    .setExternalDoc('Deployed Swagger JSON', `${swaggerBaseUrl}/api-json`)

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.use(new HttpLogger().use);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
