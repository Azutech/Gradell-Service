import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Data Trap' })
  @ApiProperty({ description: 'Product price', example: 6745 })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Data TRaps with the bang',
  })
  description: string;

  @ApiProperty({ description: 'Product brand', example: 'Gucci' })
  brand: string;
}
export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Data Trap' })
  @ApiProperty({ description: 'Product price', example: 6745 })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Data TRaps with the bang',
  })
  description: string;

  @ApiProperty({ description: 'Product brand', example: 'Gucci' })
  brand: string;
}
