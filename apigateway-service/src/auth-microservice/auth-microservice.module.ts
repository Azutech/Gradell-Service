import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthMicroserviceService } from './auth-microservice.service';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  imports: [
    HttpModule, // Add HttpModule here
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              'amqps://fwruvcta:TzXM69bOmQr02gmCL8p4MUMuPKf5r5xg@cow.rmq2.cloudamqp.com/fwruvcta',
            ],
            queue: 'auth_microservice',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService],
})
export class AuthMicroserviceModule {}
