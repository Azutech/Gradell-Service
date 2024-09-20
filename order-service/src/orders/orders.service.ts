import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import axios from 'axios';
import { Status } from 'src/utils/type';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  // Create an order with multiple products and quantity
  async create(createOrderDto: CreateOrderDto) {
    const { userId, products, shippingAddress } = createOrderDto;

    const retrievedProducts = [];

    for (const product of products) {
      try {
        const response = await axios.get(
          `http://localhost:4042/api/v1/products/product?id=${product.productId}`,
        );
        const retrievedProduct = response.data;

        retrievedProducts.push({
          productId: product.productId, // Add the productId property
          price: retrievedProduct.price,
          quantity: product.quantity,
        });
      } catch (error) {
        throw new NotFoundException(
          `Product with ID ${product.productId} not found`,
        );
      }
    }

    const totalPrice = retrievedProducts.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    const newOrder = new this.orderModel({
      userId,
      products: retrievedProducts,
      totalPrice,
      shippingAddress,
    });

    if (!newOrder) {
      throw new HttpException('Order Not Created', HttpStatus.BAD_REQUEST);
    }

    return newOrder.save();
  }

  async getUser(userId: string) {
    let retrievedUser;

    try {
      const response = await axios.get(
        `http://localhost:4041/api/v1/auth?id=${userId}`,
      );
      retrievedUser = response.data;

      // You might want to do something with retrievedUser here
      return retrievedUser;
    } catch (error) {
      // Handle error and log or throw an appropriate message
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  // Find all orders by user
  async findOrdersByUser(userId: string) {
    const orders = await this.orderModel.find({ userId }).exec();
    if (orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }
    return orders;
  }

  // Cancel an order
  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'Cancelled') {
      throw new HttpException(
        'Order is already cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cancelOrder = await this.orderModel.findByIdAndUpdate(
      { _id: orderId }, // Filter by the orderId
      { status: 'Cancelled' },
      { new: true }, // Set the status to Canceled
    );

    return {
      data: cancelOrder,
    };
  }
  async shipOrder(orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === Status.SHIPPED) {
      // Use enum if applicable
      throw new HttpException(
        'Order is already Shipped',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(order.status);

    // Use the enum value instead of the string

    const shipOrder = await this.orderModel.findByIdAndUpdate(
      { _id: orderId }, // Filter by the orderId
      { status: 'Shipped' }, // Set the status to Canceled
      { new: true },
    );

    return {
      data: shipOrder,
    };
  }

  async allCancelledOrder() {
    const order = await this.orderModel
      .find({ status: Status.CANCELLED })
      .exec();

    if (order.length === 0) {
      throw new NotFoundException('No cancelled Order Found');
    }

    return {
      data: order,
    };
  }
  async allShippedOrder() {
    const order = await this.orderModel.find({ status: Status.SHIPPED }).exec();

    if (order.length === 0) {
      throw new NotFoundException('No Shipped Orders Found');
    }

    return {
      data: order,
    };
  }

  async allShippedOrdersForUser(userId: string) {
    // Assuming the order document has a field named 'userId' or similar to link to the user
    const orders = await this.orderModel
      .find({
        userId: userId,
        status: Status.SHIPPED,
      })
      .exec();

    if (orders.length === 0) {
      throw new NotFoundException('No shipped orders found for this user');
    }

    return {
      data: orders,
    };
  }
  async allCancelledOrdersForUser(userId: string) {
    // Assuming the order document has a field named 'userId' or similar to link to the user
    const orders = await this.orderModel
      .find({
        userId: userId,
        status: Status.CANCELLED,
      })
      .exec();

    if (orders.length === 0) {
      throw new NotFoundException('No cancelled orders found for this user');
    }

    return {
      data: orders,
    };
  }

  async deleteOrder(orderId: string) {
    const result = await this.orderModel.deleteOne({ _id: orderId }).exec();

    if (!result) {
      throw new NotFoundException('Order not found or already deleted');
    }

    return { message: 'Order successfully deleted' };
  }
  async allOrder() {
    const result = await this.orderModel.find({ }).exec();

    if (result.length === 0) {
      throw new NotFoundException('Order not found or already deleted');
    }

    return { message: 'All Orders retrieved successfully', data: result };
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findOne({_id: orderId});

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedProducts = [];

    for (const updatedProduct of updateOrderDto.products) {
      try {
        // Fetch the latest product information
        const response = await axios.get(
          `http://localhost:4042/api/v1/products/product?id=${updatedProduct.productId}`,
        );
        const retrievedProduct = response.data;

        updatedProducts.push({
          productId: updatedProduct.productId,
          price: retrievedProduct.price,
          quantity: updatedProduct.quantity,
        });
      } catch (error) {
        throw new NotFoundException(
          `Product with ID ${updatedProduct.productId} not found`,
        );
      }
    }

    // Replace the entire products array
    order.products = updatedProducts;

    // Recalculate total price
    order.totalPrice = order.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    if (updateOrderDto.shippingAddress) {
      order.shippingAddress = updateOrderDto.shippingAddress;
    }

    await order.save();

    return order;
  }
}
