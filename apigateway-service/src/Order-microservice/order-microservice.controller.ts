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
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBearerAuth, ApiBody,  ApiOperation, ApiResponse, } from '@nestjs/swagger';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('order')
export class OrderServiceController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({status: HttpStatus.CREATED, description: 'Order Created Successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Product with ID not found', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status:  HttpStatus.INTERNAL_SERVER_ERROR,description: 'Failed Request',})
  @ApiBody({ type: CreateOrderDto })
  @Post('createOrder')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: any, @Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService
          .post(
            `${orderServiceUrl}/orders/create?id=${req.user.id}`,
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
  @ApiOperation({ summary: 'Retrieve orders for a user' })
  @ApiResponse({status: HttpStatus.OK, description: 'User Orders retrieved successfully', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status:  HttpStatus.INTERNAL_SERVER_ERROR,description: 'Failed to fetch user data',})
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .get(`${orderServiceUrl}/orders/userOrder?id=${req.user.id}`)
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
        messsage: `User's Order retrieved`,
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
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({status: HttpStatus.OK, description: 'Order cancelled successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Order not found', })
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Order is already cancelled', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status:  HttpStatus.INTERNAL_SERVER_ERROR,description: 'Failed to fetch user data'})
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async allProducts(@Req() req, @Query('orderId') orderId: string) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .put(`${orderServiceUrl}/orders/cancelOrder?orderId=${orderId}`)
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
  @ApiOperation({ summary: 'Mark order as shipped' })
  @ApiResponse({status: HttpStatus.OK, description: 'Order marked as shipped', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Order not found', })
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Order is already Shipped', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status:  HttpStatus.INTERNAL_SERVER_ERROR,description: 'Failed to fetch user data',})

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateProducts(@Query('orderId') orderId: string) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .put(`${orderServiceUrl}/orders/shipOrder?orderId=${orderId}`)
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
        messsage: ' Order shipped Sucessfully',
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
  @ApiOperation({ summary: 'Get all shipped orders' })
  @ApiResponse({status: HttpStatus.OK, description: 'All shipped orders retrieved successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'No Shipped Orders Found', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async allShippedOrders(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService.get(`${orderServiceUrl}/orders/allShippedOrders`).pipe(
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
  @ApiOperation({ summary: 'Get all cancelled orders' })
  @ApiResponse({status: HttpStatus.OK, description: 'All cancelled orders retrieved successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'No cancelled Order Found', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async allCancelledOrder(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .get(`${orderServiceUrl}/orders/allCancelledOrder`)
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
        messsage: 'All cancelled orders retrieved successfully',
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
  @ApiOperation({ summary: 'Get all  orders' })
  @ApiResponse({status: HttpStatus.OK, description: 'All Orders retrieved successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Order not found or already deleted', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async allOrder(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService.get(`${orderServiceUrl}/orders/allOrders`).pipe(
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
        messsage: 'All Orders retrieved successfully',
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
  @ApiOperation({ summary: 'Get all cancelled orders for user' })
  @ApiResponse({status: HttpStatus.OK, description: 'Cancelled Order returned successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'No cancelled orders found for this user', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async CancelledOrderForUser(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .get(
            `${orderServiceUrl}/orders/CancelledOrderForUser?userId=${req.user.id}`,
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
        messsage: 'Cancelled Order returned Successfully',
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
  @ApiOperation({ summary: 'Get all shipped orders for user' })
  @ApiResponse({status: HttpStatus.OK, description: 'Shipped Order for user returned successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'No shipped orders found for this user', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async ShippedOrderForUser(@Req() req) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .get(
            `${orderServiceUrl}/orders/ShippedOrderForUser?userId=${req.user.id}`,
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
        messsage: 'Shipped Order returned Successfully',
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
  @ApiOperation({ summary: 'delete orders' })
  @ApiResponse({status: HttpStatus.OK, description: 'Order deleted successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Order not found or already deleted', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteOrder(@Req() req, @Query('orderId') orderId: string) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .delete(`${orderServiceUrl}/orders/deleteOrder?orderId=${orderId}`)
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
        messsage: 'Order deleted Successfully',
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
  @ApiOperation({ summary: 'Update orders' })
  @ApiResponse({status: HttpStatus.OK, description: 'Order updated successfully', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Order not found', })
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: '`Product with ID  not found', })
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'No token provided, Unauthorized', })
  @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch user data', })
  @ApiBody({ type: UpdateOrderDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Body() updateOrderDto: any,
    @Req() req,
    @Query('orderId') orderId: string,
  ) {
    const orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');

    try {
      const result = await lastValueFrom(
        this.httpService
          .put(
            `${orderServiceUrl}/orders/updateOrder?orderId=${orderId}`,
            updateOrderDto,
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
