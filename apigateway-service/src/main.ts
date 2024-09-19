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

  const config = new DocumentBuilder()
  .setTitle('Auth Microservice API')
  .setDescription('API documentation for the Auth microservice')
  .setVersion('1.0')
  .addBearerAuth()  // If you're using JWT
  .build();



  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  app.use(new HttpLogger().use);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
