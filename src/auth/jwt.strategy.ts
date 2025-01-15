import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { Request, Response } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from Authorization header
            ignoreExpiration: false,
            secretOrKey: 'key', // Ensure this matches the key used to sign the JWT
        });
    }

    async validate(payload: any, req: Request, res: Response) {

        if (!payload) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return payload;
    }
}
