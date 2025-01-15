import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, // Use private or another access modifier
        private jwtService: JwtService,
    ) { }


    // Generate Access and Refresh Tokens
    async generateTokens(user: any) {

        const payload = {
            id: user._id.toString(),
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        }

        const token = this.jwtService.sign(payload);

        return token;
    }


}
