import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        // Access cookies from the request
        const token = req.cookies['token'];

        if (!req.headers['authorization'] && token) {
            // If the token exists in cookies, set it as Bearer token in the Authorization header
            req.headers['authorization'] = `Bearer ${token}`;
        } else {
            console.log('No token found');
        }

        next();
    }
}
