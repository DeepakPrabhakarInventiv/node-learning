import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    AuthModule,
    ProductModule,
    CartModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Ensure the middleware is applied first
      .forRoutes(
        { path: '*', method: RequestMethod.ALL },
      );
  }

}
