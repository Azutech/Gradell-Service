import {
  Controller,
  Body,
  HttpCode,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@Controller('user')
export class AuthMicroserviceController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: any) {
    const authServiceUrl = this.configService.get<string>('USER_SERVICE_URL'); // Get the base URL from ConfigService

    try {
      const result = await lastValueFrom(
        this.httpService
          .post(`${authServiceUrl}/auth/register`, createUserDto)
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response) {
                // If there's a response from the microservice, use its status and data
                throw new HttpException(
                  error.response.data,
                  error.response.status,
                );
              } else {
                // If there's no response (e.g., network error), throw a generic error
                throw new HttpException(
                  'Failed Request',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
            }),
          ),
      );
      return result.data;
    } catch (error) {
      // This catch block will handle any errors thrown in the try block
      if (error instanceof HttpException) {
        // If it's already an HttpException, just rethrow it
        throw error;
      } else {
        // For any other type of error, throw a generic error
        throw new HttpException(
          'Unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createUserDto: any) {
    const authServiceUrl = this.configService.get<string>('USER_SERVICE_URL'); // Get the base URL from ConfigService

    try {
      const result = await lastValueFrom(
        this.httpService
          .post(`${authServiceUrl}/auth/login`, createUserDto)
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response) {
                // If there's a response from the microservice, use its status and data
                throw new HttpException(
                  error.response.data,
                  error.response.status,
                );
              } else {
                // If there's no response (e.g., network error), throw a generic error
                throw new HttpException(
                  'Failed to register user',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
            }),
          ),
      );
      return result.data;
    } catch (error) {
      // This catch block will handle any errors thrown in the try block
      if (error instanceof HttpException) {
        // If it's already an HttpException, just rethrow it
        throw error;
      } else {
        // For any other type of error, throw a generic error
        throw new HttpException(
          'Unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req) {
    try {
      const authServiceUrl = this.configService.get<string>('USER_SERVICE_URL'); // Get the base URL from ConfigService

      const result = await lastValueFrom(
        this.httpService.get(`${authServiceUrl}/auth?id=${req.user.id}`).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(
                error.response.data,
                error.response.status,
              );
            } else {
              throw new HttpException(
                'Failed to fetch user data',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          }),
        ),
      );
      return {
        messsage: 'DashBoard retrieved',
        data: result.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
