import { Controller, Body, Post, HttpException, HttpStatus, Req, UseGuards, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JwtAuthGuard } from 'src/guard/jwt.guard';


@Controller('user')
export class AuthMicroserviceController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    try {
      const result = await lastValueFrom(
        this.httpService.post('http://localhost:4041/api/v1/auth/register', createUserDto).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              // If there's a response from the microservice, use its status and data
              throw new HttpException(error.response.data, error.response.status);
            } else {
              // If there's no response (e.g., network error), throw a generic error
              throw new HttpException('Failed Request', HttpStatus.INTERNAL_SERVER_ERROR);
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
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Post ('login')

  async login (@Body() createUserDto: any) {
    try {
      const result = await lastValueFrom(
        this.httpService.post('http://localhost:4041/api/v1/auth/login', createUserDto).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              // If there's a response from the microservice, use its status and data
              throw new HttpException(error.response.data, error.response.status);
            } else {
              // If there's no response (e.g., network error), throw a generic error
              throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR);
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
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req) {
    try {
      console.log("wrong")
      const result = await lastValueFrom(
        this.httpService.get(`http://localhost:4041/api/v1/auth?id=${req.user.id}`).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed to fetch user data', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return result.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }



}