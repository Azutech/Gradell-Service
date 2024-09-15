import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProductsServiceController } from './product-microservice.controller';
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
  controllers: [ProductsServiceController],
})
export class ProductsServiceModule {}
