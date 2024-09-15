import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';
import { Status } from 'src/utils/type';

@Schema()
export class Order extends Document {
  @Prop({})
  userId: string;

  @Prop([
    {
      productId: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ])
  products: {
    productId: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    default: 'Pending',
  })
  status: Status;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({
    default: moment.utc().toDate(),
  })
  orderDate: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);