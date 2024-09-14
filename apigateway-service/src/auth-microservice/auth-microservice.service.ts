import { Injectable, Inject, HttpException } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/createUser';
@Injectable()
export class AuthMicroserviceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal server error';

  connection(): Observable<any> {
    return this.clientAuthService
      .send({ cmd: 'CONNECTION_CHECK' }, {})
      .pipe(map((message: string) => message));
  }
  createUser(createUserDto: CreateUserDto): Observable<any> {
    try {
      // console.log('Sending create_user message with DTO:', createUserDto);
      return this.clientAuthService.send<any>(
        { cmd: 'create_user' },
        createUserDto,
      );

      // return createUserDto
    } catch (err: any) {
      console.log(err);
      throw new HttpException(
        err?.message ? err.message : this.ISE,
        err?.status ? err.status : 500,
      );
    }
  }
}
