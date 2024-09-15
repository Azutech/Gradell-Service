// import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


// export class CreateOrderDto {
//     @IsString()
//     @IsNotEmpty()
//     userId  
//     @IsNumber()
//     @IsNotEmpty()
//     productId: Number;
  
//     @IsString()
//     @IsNotEmpty()
//     quantity: string;
  
//     @IsString()
//     @IsNotEmpty()
//     shippingAddress: string;
// }

export class CreateOrderDto {
    readonly userId: string
    readonly products: { productId: string; quantity: number }[];
    readonly shippingAddress: string;
  }
