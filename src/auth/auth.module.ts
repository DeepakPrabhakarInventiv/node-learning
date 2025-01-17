import { forwardRef, Global, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LoggedInterceptor } from './logged.interceptor';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';

@Global()
@Module({
    imports: [UserModule,
        JwtModule.register({
            secret: "key",
            signOptions: { expiresIn: '1h' },
        }),
        CartModule,
        WishlistModule
    ],
    controllers: [],
    providers: [AuthService, LocalStrategy, JwtStrategy, LoggedInterceptor],
    exports: [AuthService, LoggedInterceptor, JwtModule]
})
export class AuthModule {

}
