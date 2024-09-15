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
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@Controller('products')
export class ProductsServiceController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProduct')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: any) {
    try {
      const result = await lastValueFrom(
        this.httpService
          .post(
            'http://localhost:4042/api/v1/products/createProduct',
            createUserDto,
          )
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
      return { message: 'Product Created Sucessfully', data: result.data };
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

  @Get('getProduct')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req, @Query('productId') productId: string) {
    try {
      const result = await lastValueFrom(
        this.httpService
          .get(`http://localhost:4042/api/v1/products/product?id=${productId}`)
          .pipe(
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
  @Get('allProducts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async allProducts(@Req() req) {
    try {
      const result = await lastValueFrom(
        this.httpService
          .get(`http://localhost:4042/api/v1/products/allProducts`)
          .pipe(
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
        messsage: 'All Product retrieved',
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
  @Put('updateProduct')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateProducts(
    @Body() createUserDto: any,
    @Query('productId') productId: string,
  ) {
    try {
      const result = await lastValueFrom(
        this.httpService
          .put(
            `http://localhost:4042/api/v1/products/updateProduct?id=${productId}`,
            createUserDto,
          )
          .pipe(
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
        messsage: ' Product Updated Sucessfully',
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
  @Delete('deleteProduct')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Req() req, @Query('productId') productId: string) {
    try {
      const result = await lastValueFrom(
        this.httpService
          .delete(
            `http://localhost:4042/api/v1/products/delete?id=${productId}`,
          )
          .pipe(
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
        messsage: 'Product deleted Successfully',
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
