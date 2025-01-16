import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async doLogin(@Req() req: Request, @Res() res: Response) {

    const accessToken = await this.authService.generateTokens(req.user);

    res.cookie('token', accessToken, {
      secure: true, // Ensures the cookie is sent over HTTPS
      sameSite: 'strict', // Prevents CSRF attacks
      path: '/', // Makes the cookie available across the site
    });

    // Send the access token in the response
    return res.send(accessToken);

  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
