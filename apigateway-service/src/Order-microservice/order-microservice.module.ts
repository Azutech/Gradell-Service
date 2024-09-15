import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OrderServiceController } from './order-microservice.controller'
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
  ],
  controllers: [OrderServiceController],
})
export class OrderServiceModule {}