import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { LoggingInterceptor} from './utils/logger.receptor'
import * as http from 'http';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  const brokerUrl = configService.get<string>('RABBIT_MQ_URI');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [brokerUrl],
      queue: 'prescriptions_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.setGlobalPrefix('api'); // This will add 'api' prefix to all routes

  // Apply global validation pipe (optional but recommended)
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new LoggingInterceptor());

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end('This is a placeholder HTTP response');
  });

  server.listen(5001);

  await app.listen(port, () =>
    logger.log(`User Microservice: EventBus: ${brokerUrl}`),
  );
}
bootstrap();
