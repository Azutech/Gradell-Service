import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Query,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create an order with multiple products
  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Query('id') id: string,
  ) {
    try {
      const user = await this.ordersService.getUser(id);

      // Add userId to createOrderDto
      const orderDtoWithUserId = { ...createOrderDto, userId: id };

      // Create order with updated DTO
      const result = await this.ordersService.create(orderDtoWithUserId);

      return {
        message: 'Order created successfully',
        user: user.email,
        result,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get all orders for a user
  @Get('userOrder')
  async getOrdersByUser(@Query('userId') userId: string) {
    try {
      const orders = await this.ordersService.findOrdersByUser(userId);
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Cancel an order
  @Put('cancelOrder')
  async cancelOrder(@Query('orderId') orderId: string) {
    try {
      const result = await this.ordersService.cancelOrder(orderId);
      return {
        message: 'Order canceled successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('allOrders')
  async allOrder() {
    try {
      const result = await this.ordersService.allOrder();
      return {
        message: 'all Order  successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Put('shipOrder')
  async shipOrder(@Query('orderId') orderId: string) {
    try {
      const result = await this.ordersService.shipOrder(orderId);
      return {
        message: 'Order shipped successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('allShippedOrders')
  async allShippedOrders() {
    try {
      const result = await this.ordersService.allShippedOrder();
      return {
        message: 'Shipped Order returned successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('allCancelledOrder')
  async allCancelledOrder() {
    try {
      const result = await this.ordersService.allCancelledOrder();
      return {
        message: 'Cancelled Order returned successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('CancelledOrderForUser')
  async allCancelledOrderForUser(@Query('userId') userId: string) {
    try {
      const result = await this.ordersService.allCancelledOrdersForUser(userId);
      return {
        message: 'Cancelled Order returned successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('ShippedOrderForUser')
  async allShippedOrdersForUser(@Query('userId') userId: string) {
    try {
      const result = await this.ordersService.allShippedOrdersForUser(userId);
      return {
        message: 'Cancelled Order returned successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('deleteOrder')
  async deleteOrder(@Query('orderId') orderId: string) {
    try {
      const removeOrder = await this.ordersService.deleteOrder(orderId);
      return {
        message: 'Order deleted returned successfully',
        removeOrder,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('updateOrder')
  async editOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Query('orderId') orderId: string,
  ) {
    try {
      const updatedOrder = await this.ordersService.update(
        orderId,
        updateOrderDto,
      );
      return {
        message: 'Order updated successfully',
        updatedOrder,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
