import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    readonly products: { productId: string; quantity: number }[];
    readonly shippingAddress: string;
}
