import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Res, UseInterceptors, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LoggedInterceptor } from 'src/auth/logged.interceptor';
import { PaginationDto } from './dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @Post()
  create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('')
  findAll(@Query() paginationDto: PaginationDto) {

    // console.log(paginationDto);

    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}


