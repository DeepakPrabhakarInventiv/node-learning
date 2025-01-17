import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { LoggedInterceptor } from 'src/auth/logged.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/user/schema/user.schema';
import { ProductService } from 'src/product/product.service';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService, private readonly productService: ProductService) { }

  @Post()
  async create(@Body('product_id') product_id: any, @Req() req: any): Promise<any> {

    // Validate product existence
    const product = await this.productService.findOne(product_id.toString());
    if (!product) {
      throw new HttpException({ message: 'Product not found' }, HttpStatus.BAD_REQUEST);
    }

    const currentuserId = req.user.id;

    // Set the encrypted password in the DTO
    const createWishlistDtoUpdated = {
      product_id: product_id,
      user_id: currentuserId, // Accessing `id` safely
    };

    return this.wishlistService.create(createWishlistDtoUpdated);
  }


  @Post('/products')
  async getUserCartProducts(@Req() req: any): Promise<any> {
    const currentuserId = req.user.id;
    const cart_products = await this.wishlistService.findByUserId(currentuserId);

    return cart_products;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistService.update(+id, updateWishlistDto);
  }

  @Post('/delete')
  async deleteWishlist(@Body('id') wishlistid: any, @Req() req: any): Promise<any> {
    const currentuserId = req.user.id;
    return await this.wishlistService.deleteWishlist(wishlistid, currentuserId);
  }
}
