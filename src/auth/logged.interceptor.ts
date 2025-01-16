import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class LoggedInterceptor implements NestInterceptor {
    constructor(private readonly jwtService: JwtService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();

        const authHeader = request.headers.authorization;
        let isLoggedIn = false;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]; // Extract token
            try {
                const payload = this.jwtService.verify(token, {
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


            } catch (error) {
                console.error('Invalid or expired token:', error.message);
            }
        }

        // Add isLoggedIn to response.locals for use in Handlebars templates
        response.locals.isLoggedIn = isLoggedIn;

        return next.handle(); // Proceed with the request handling
    }
}
