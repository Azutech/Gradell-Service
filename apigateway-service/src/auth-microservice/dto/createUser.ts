// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   IsStrongPassword,
// } from 'class-validator';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsEmail()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsStrongPassword({
//     minLength: 8,
//     minLowercase: 1,
//     minUppercase: 1,
//     minNumbers: 1,
//     minSymbols: 1,
//   })
//   password: string;
// }


import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNumber: string;
}

