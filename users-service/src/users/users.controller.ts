import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Res,
  Query,
  NotFoundException,
  
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create(createUserDto);
      return {
        message: 'User Created successfully',
        statusCode: HttpStatus.CREATED,
        result,
      };
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(
        error.response || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('login')
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    try {
      const user = await this.usersService.login(loginUserDto);

      const token = await this.usersService.generateToken(user);

      return {
        message: 'Login successful',
        statusCode: HttpStatus.OK,
        user,
        token,
      };
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(
        error.response || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getUserById(@Query('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
