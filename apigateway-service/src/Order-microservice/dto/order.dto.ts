import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'List of products',
    example: [
      { productId: '66e6275dd80b33992dc02f6f', quantity: 2 },
      { productId: '66e6275dd80b33992dc02f6f', quantity: 1 },
    ],
  })
  readonly products: { productId: string; quantity: number }[];

  @ApiProperty({
    description: 'Shipping Address',
    example: '34 Salisu Street Abuja',
  })
  shippingAddress: string;
}
export class UpdateOrderDto {
  @ApiProperty({
    description: 'List of products',
    example: [
      { productId: '66e6275dd80b33992dc02f6f', quantity: 2 },
      { productId: '66e655ca0ee501ba2a99c95e', quantity: 1 },
    ],
  })
  readonly products: { productId: string; quantity: number }[];

  @ApiProperty({
    description: 'Shipping Address',
    example: '34 Salisu Street Abuja',
  })
  shippingAddress: string;
}
