export class CreateOrderDto {
    readonly userId: string;
    readonly products: { productId: string; quantity: number }[];
    readonly shippingAddress: string;
  }