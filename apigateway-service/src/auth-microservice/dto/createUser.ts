import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'User full name', example: '080938290455' })
  phoneNumber: string;
}

export class LoginUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}
