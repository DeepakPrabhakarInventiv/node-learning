import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), AuthModule, UserModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
