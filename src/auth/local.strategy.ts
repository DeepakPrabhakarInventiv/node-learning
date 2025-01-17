import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { use } from "passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService, private jwtService: JwtService) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.userService.findByEmail(username); ``

        if (!user) {
            throw new UnauthorizedException("user not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new UnauthorizedException("email or password do not match");

        //Generate Token
        const payload = {
            id: user._id.toString(),
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        }

        const token = this.jwtService.sign(payload);


        return {
            success: true,
            message: 'Login successfull',
            user: user,
            token: token,
        };

    }

}