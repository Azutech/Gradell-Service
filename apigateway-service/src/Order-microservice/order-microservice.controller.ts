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
  
  
  @Controller('order')
  export class OrderServiceController {
    constructor(private readonly httpService: HttpService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('createOrder')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: any, @Req() req) {
        console.log(req.user.id)
      try {
        const result = await lastValueFrom(
          this.httpService
            .post(
              `http://localhost:4043/api/v1/orders/create?id=${req.user.id}`,
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
        return { message: 'Order Created Sucessfully', data: result.data };
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
  
    @Get('userOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async dashboard(@Req() req, ) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(`http://localhost:4043/api/v1/orders/userOrder?id=${req.user.id}`)
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
          messsage: 'User Orders retrieved',
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
    @Put('cancelOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async allProducts(@Req() req, @Query('orderId') orderId: string) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .put(`http://localhost:4043/api/v1/orders/cancelOrder?orderId=${orderId}`)
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
          messsage: 'Order Cancelled!!🙁',
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
    @Put('shipOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateProducts(
      @Query('orderId') orderId: string,
    ) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .put(
              `http://localhost:4043/api/v1/orders/shipOrder?orderId=${orderId}`,
              
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
    @Get('allShippedOrders')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Req() req,) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(
              `http://localhost:4043/api/v1/orders/allShippedOrders`,
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
    @Get('allCancelledOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async allCancelledOrder(@Req() req,) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(
              `http://localhost:4043/api/v1/orders/allCancelledOrder`,
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
    @Get('allOrders')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async allOrder(@Req() req,) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(
              `http://localhost:4043/api/v1/orders/allOrders`,
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
          messsage: 'Order returned Successfully',
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
    @Get('CancelledOrderForUser')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async CancelledOrderForUser(@Req() req,) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(
              `http://localhost:4043/api/v1/orders/CancelledOrderForUser?userId=${req.user.id}`,
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
          messsage: 'Order returned Successfully',
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
    @Get('ShippedOrderForUser')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async ShippedOrderForUser(@Req() req,) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .get(
              `http://localhost:4043/api/v1/orders/ShippedOrderForUser?userId=${req.user.id}`,
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
    @Delete('deleteOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteOrder(@Req() req, @Query('orderId') orderId: string) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .delete(
              `http://localhost:4043/api/v1/orders/deleteOrder?orderId=${orderId}`,
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
    @Put('updateOrder')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateOrder(@Body() updateOrderDto: any, @Req() req, @Query('orderId') orderId: string) {
      try {
        const result = await lastValueFrom(
          this.httpService
            .put(
              `http://localhost:4043/api/v1/orders/updateOrder?orderId=${orderId}`,
              updateOrderDto
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
          messsage: 'Order Updated Successfully',
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
    
