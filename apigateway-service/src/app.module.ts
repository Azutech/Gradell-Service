import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMicroserviceModule } from './auth-microservice/auth-microservice.module';
import { ProductsServiceModule } from './product-microservice/product-microservice.module';
import { OrderServiceModule } from './Order-microservice/order-microservice.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),
    AuthMicroserviceModule,
    ProductsServiceModule,
    OrderServiceModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
