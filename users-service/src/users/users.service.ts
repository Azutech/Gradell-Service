import {
  ConflictException,
  HttpException,
  Injectable,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, phoneNumber } = createUserDto;

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException('User with this email already not exist');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    if (!createdUser) {
      throw new HttpException("Users can not created", HttpStatus.BAD_REQUEST)
    }
    return createdUser.save();
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (user.status === 'Inactive') {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong Password');
    }

    const userObject = user.toObject();

    // Remove the password from the response object
    delete userObject.password;

    return userObject;
  }

  async generateToken(user: User): Promise<string> {
    const payload = {
      id: user._id, // user._id or user.id (depending on how your user schema is set)
      email: user.email,
      name: user.name, // Ensure that these fields exist on the user object
      phoneNumber: user.phoneNumber,
      status: user.status,
    };
    return this.jwtService.sign(payload);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
