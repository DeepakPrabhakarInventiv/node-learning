import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LoggedInterceptor } from './logged.interceptor';

@Module({
    imports: [forwardRef(() => UserModule),
    JwtModule.register({
        secret: "key",
        signOptions: { expiresIn: '1h' },
    })
    ],
    controllers: [],
    providers: [AuthService, LocalStrategy, JwtStrategy, LoggedInterceptor],
    exports: [AuthService, JwtStrategy, LoggedInterceptor, JwtModule]
})
export class AuthModule {

}
