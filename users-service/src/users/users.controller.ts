import {  Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}



  @Post('register')
  async createUser(@Payload() createUserDto: CreateUserDto, @Ctx() context: RmqContext) {
   
    try {
      const result = await this.usersService.create(createUserDto);
      return result;
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(error.response || error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('login')
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
   
    try {
      const user = await this.usersService.login(loginUserDto);

      const token = await this.usersService.generateToken(user)


      return{user, token }
      
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(error.response || error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  }



