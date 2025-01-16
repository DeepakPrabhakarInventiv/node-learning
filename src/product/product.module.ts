import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
