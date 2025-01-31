import { Controller, Get, HttpException, HttpStatus, Param, Query, Render, Req, Res, UnauthorizedException, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoggedInterceptor } from './auth/logged.interceptor';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { CartService } from './cart/cart.service';
import { UnAuthorizedFilter } from './filter/unauthorised.filter';
import { OrderService } from './order/order.service';
import { PaginationDto } from './product/dto/pagination.dto';


@Controller()
@UseInterceptors(LoggedInterceptor)
@UseFilters(UnAuthorizedFilter)
export class AppController {

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private cartService: CartService,

  ) { }

  @Get('/')
  homePage(@Res() res: Response) {
    return res.render('home', { title: 'Home Page' });
  }

  @Get('/login')
  loginPage(@Res() res: Response) {
    if (res.locals.isLoggedIn) return res.redirect('/');
    return res.render('login', { title: 'Login Page' });
  }

  @Get('/registration')
  registrationPage(@Res() res: Response) {
    if (res.locals.isLoggedIn) return res.redirect('/');
    return res.render('registration', { title: 'Registration Page' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profilePage(@Req() req: any, @Res() res: Response) {
    const currentUserId = req.user.id;
    const user = await this.userService.findOne(currentUserId);
    return res.render('profile', {
      title: 'Profile Page',
      user: user,
    });
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logoutPage(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');
    return res.redirect('/login');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/products')
  async getProducts(@Res() res: Response, @Query() paginationDto: PaginationDto) {
    const productsData = await this.productService.findAll(paginationDto);
    return res.render('products', {
      title: 'Products',
      products: productsData.products,
      nextPage: productsData.nextPage,
      prevPage: productsData.prevPage,
      totalPages: productsData.totalPages,
      currentPage: productsData.currentPage,
      sortby: paginationDto.sortby,
      search: paginationDto.search
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/cart')
  cartPage(@Req() req: Request, @Res() res: Response) {
    return res.render('cart', { title: 'Cart Page' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/wishlist')
  wishlistPage(@Req() req: Request, @Res() res: Response) {
    return res.render('wishlist', { title: 'Wishlist Page' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/checkout')
  async CheckoutPage(@Req() req: any, @Res() res: Response) {
    const currentUserId = req.user.id;
    const userData = await this.userService.findOne(currentUserId);
    const cartData = await this.cartService.findByUserId(currentUserId);

    return res.render('checkout', {
      title: 'Checkout Page',
      user: userData,
      cart: cartData,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/order-success/:id')
  async OrderSuccessPage(@Param('id') orderid: string, @Req() req: any, @Res() res: Response) {

    const orderData = await this.orderService.findOne(orderid);

    if (req.user.id != orderData.user_id.toString()) {
      throw new HttpException({ message: 'This order does not belogs to you.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return res.render('order-success', {
      title: 'Success Page',
      order: orderData,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/my-orders')
  async userOrders(@Req() req: any, @Res() res: Response) {
    const currentUserId = req.user.id;
    const ordersData = await this.orderService.orderByUserId(currentUserId);

    return res.render('user-orders', {
      title: 'All Order',
      orders: ordersData,
    });
  }

}
