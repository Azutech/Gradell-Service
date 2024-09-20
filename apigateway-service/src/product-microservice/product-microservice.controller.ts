import {
  Controller,
  Body,
  HttpCode,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsServiceController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProduct')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Product created successfully.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBody({ type: CreateProductDto })  // Assume CreateProductDto is defined elsewhere
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: any) {
    const productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService.post(`${productServiceUrl}/products/createProduct`, createUserDto).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed Request', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return { message: 'Product Created Successfully', data: result.data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get product details by ID
  @Get('getProduct')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async dashboard(@Req() req, @Query('productId') productId: string) {
    const productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService.get(`${productServiceUrl}/products/product?id=${productId}`).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed to fetch product data', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return { message: 'Product retrieved successfully', data: result.data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get all products
  @Get('allProducts')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All products retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async allProducts(@Req() req) {
    const productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService.get(`${productServiceUrl}/products/allProducts`).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed to fetch product data', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return { message: 'All Products retrieved', data: result.data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update a product by ID
  @Put('updateProduct')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: UpdateProductDto }) 
  @ApiResponse({ status: HttpStatus.OK, description: 'Product updated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProducts(@Body() createUserDto: any, @Query('productId') productId: string) {
    const productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService.put(`${productServiceUrl}/products/updateProduct?id=${productId}`, createUserDto).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed to update product data', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return { message: 'Product Updated Successfully', data: result.data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a product by ID
  @Delete('deleteProduct')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Req() req, @Query('productId') productId: string) {
    const productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    try {
      const result = await lastValueFrom(
        this.httpService.delete(`${productServiceUrl}/products/delete?id=${productId}`).pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            } else {
              throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }),
        ),
      );
      return { message: 'Product deleted successfully', data: result.data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
