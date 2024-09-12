import {  Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const result = await this.usersService.create(createUserDto);
    channel.ack(originalMessage); // Acknowledge message
    return result;
  }

  

}
