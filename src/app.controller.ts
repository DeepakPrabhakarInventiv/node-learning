import { Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoggedInterceptor } from './auth/logged.interceptor';
import { UserService } from './user/user.service';

@UseInterceptors(LoggedInterceptor)
@Controller()
export class AppController {

  constructor(private userService: UserService) { }

  @Get('/')
  homePage(@Res() res: Response) {
    return res.render('home', { title: 'Home Page' });
  }

  @Get('/login')
  loginPage(@Res() res: Response) {
    return res.render('login', { title: 'Login Page' });
  }

  @Get('/registration')
  registrationPage(@Res() res: Response) {
    return res.render('registration', { title: 'Registration Page' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profilePage(@Req() req: Request, @Res() res: Response) {


    const user = await this.userService.findOne(req.user['id']);

    return res.render('profile', {
      title: 'Profile Page',
      loggedIn: true,
      user: user,
    });
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logoutPage(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');
    return res.redirect('/login');
  }


}
