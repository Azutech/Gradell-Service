import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Gradell Service: Top shopping for Merch!!🛍️🛒';
  }
}
