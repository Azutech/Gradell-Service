

// import { IsEmail, IsNotEmpty } from 'class-validator';

// export class CreateUserDto {
//   @IsNotEmpty()
//   name: string;

//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   password: string;

//   @IsNotEmpty()
//   phoneNumber: string;
// }

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  fullName: string;
}

export class LoginUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}

