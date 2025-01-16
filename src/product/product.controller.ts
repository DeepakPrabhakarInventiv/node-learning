import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Res, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LoggedInterceptor } from 'src/auth/logged.interceptor';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggedInterceptor)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productService.findAll();

    return res.render('products', {
      title: 'Products',
      products: products
    });
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


