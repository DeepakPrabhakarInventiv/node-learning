import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInterceptor } from 'src/auth/logged.interceptor';
import { Request, Response } from 'express';
import { User } from 'src/user/schema/user.schema';
import { ProductService } from 'src/product/product.service';
import { WishlistService } from 'src/wishlist/wishlist.service';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService, private readonly productService: ProductService, private readonly wishlistService: WishlistService) { }

  @Post()
  async create(@Body('product_id') product_id: any, @Body('count') count: number, @Req() req: any): Promise<any> {

    // Validate product existence
    const product = await this.productService.findOne(product_id.toString());
    if (!product) {
      throw new HttpException({ message: 'Product not found' }, HttpStatus.BAD_REQUEST);
    }

    //count validation
    if (product.quantity < count) {
      throw new HttpException({ message: 'Product stock not availabe' }, HttpStatus.BAD_REQUEST);
    }

    const currentuserId = req.user.id;

    // Set the encrypted password in the DTO
    const createCartDtoUpdated = {
      product_id: product_id,
      user_id: currentuserId, // Accessing `id` safely
      count: count
    };

    const cartProduct = await this.cartService.create(createCartDtoUpdated);

    //delete from wishlist
    const deleteWishlist = await this.wishlistService.deleteWishlistByPid(product_id, currentuserId);

    return cartProduct;



  }


  @Post('/products')
  async getUserCartProducts(@Req() req: any): Promise<any> {
    const currentuserId = req.user.id;
    const cart_products = await this.cartService.findByUserId(currentuserId);

    return cart_products;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {

    const product_id = updateCartDto.product_id;

    // Validate product existence
    const product = await this.productService.findOne(product_id.toString());
    if (!product) {
      throw new HttpException({ message: 'Product not found' }, HttpStatus.BAD_REQUEST);
    }

    //count validation
    if (product.quantity < updateCartDto.count) {
      throw new HttpException({ message: 'Product stock not availabe' }, HttpStatus.BAD_REQUEST);
    }



    return await this.cartService.update(id, updateCartDto);
  }

  @Post('/delete')
  async deleteCart(@Body('id') cartid: any, @Req() req: any): Promise<any> {
    const currentuserId = req.user.id;
    return await this.cartService.deleteCart(cartid, currentuserId);
  }

}
