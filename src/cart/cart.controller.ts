import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInterceptor } from 'src/auth/logged.interceptor';
import { Request, Response } from 'express';
import { User } from 'src/user/schema/user.schema';
import { ProductService } from 'src/product/product.service';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggedInterceptor)
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService, private readonly productService: ProductService) { }

  @Post()
  async create(@Body('product_id') product_id: any, @Body('count') count: number, @Req() req: Request): Promise<any> {

    // Validate product existence
    const product = await this.productService.findOne(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    const currentuser = req.user as User;

    // Set the encrypted password in the DTO
    const createCartDtoUpdated = {
      product_id: product_id,
      user_id: currentuser?._id, // Accessing `id` safely
      count: count
    };

    return this.cartService.create(createCartDtoUpdated);
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    return res.render('cart', { title: 'Cart Page' });
  }

  @Post('/products')
  async getUserCartProducts(@Req() req: Request): Promise<any> {
    const currentuser = req.user as User;
    const cart_products = await this.cartService.findByUserId(currentuser?._id);

    return cart_products;
  }

  @Post('/update')
  async updateCart(@Body('products') products: any, @Req() req: Request): Promise<any> {
    const currentuser = req.user as User;
    return await this.cartService.updateCart(products, currentuser?._id);
  }

  @Post('/delete')
  async deleteCart(@Body('id') cartid: any, @Req() req: Request): Promise<any> {
    const currentuser = req.user as User;
    return await this.cartService.deleteCart(cartid, currentuser?._id);
  }

}
