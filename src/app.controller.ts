import { Controller, Get, Render, Req, Res, UnauthorizedException, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoggedInterceptor } from './auth/logged.interceptor';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { CartService } from './cart/cart.service';
import { WishlistService } from './wishlist/wishlist.service';
import { UnAuthorizedFilter } from './filter/unauthorised.filter';


@Controller()
@UseInterceptors(LoggedInterceptor)
@UseFilters(UnAuthorizedFilter)
export class AppController {

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
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
  async profilePage(@Req() req: Request, @Res() res: Response) {


    const user = await this.userService.findOne(req.user['id']);

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
  @Get('/product')
  async getProducts(@Res() res: Response) {
    const products = await this.productService.findAll();
    return res.render('products', {
      title: 'Products',
      products: products
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


}
