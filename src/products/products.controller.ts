/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Auth, GetUser } from 'src/auth/decorators';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden Token Related' })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'The products have been founded.',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(PaginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been founded.',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been updated.',
    type: Product,
  })
  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
