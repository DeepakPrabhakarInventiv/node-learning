import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CartService } from 'src/cart/cart.service';
import { WishlistService } from 'src/wishlist/wishlist.service';

@Injectable()
export class LoggedInterceptor implements NestInterceptor {
    constructor(
        private jwtService: JwtService,
        private cartService: CartService,
        private wishlistService: WishlistService,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();

        const authHeader = request.headers.authorization;
        let isLoggedIn = false;
        let cartCount = 0;
        let wishlistCount = 0;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]; // Extract token
            try {
                const payload = await this.jwtService.verify(token, {
                    secret: 'key', // Replace with your actual secret key
                });

                // Attach the user payload to the request object if needed
                const payloadUpdated = {
                    ...payload,
                    _id: payload.id,
                };
                request['user'] = payloadUpdated;

                // User is logged in
                isLoggedIn = true;

                //cart count
                cartCount = await this.cartService.countCart(payload.id);

                //wishlist count
                wishlistCount = await this.wishlistService.countWishlist(payload.id);

            } catch (error) {
                console.error('Invalid or expired token:', error.message);
            }
        }

        // Add isLoggedIn to response.locals for use in Handlebars templates
        response.locals.isLoggedIn = isLoggedIn;
        response.locals.cartCount = cartCount;
        response.locals.wishlistCount = wishlistCount;


        return next.handle(); // Proceed with the request handling
    }
}
