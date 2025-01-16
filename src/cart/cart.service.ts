import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  productModel: any;

  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) { }

  async create(createCartDto: CreateCartDto) {

    // Validate product existence in cart
    const userProductsInCart = await this.cartModel.findOne({ user_id: createCartDto.user_id, product_id: createCartDto.product_id }).exec();

    if (!userProductsInCart) {
      //insert the product
      try {
        const createdCart = await new this.cartModel(createCartDto).save();
        return {
          message: `Product has been added in cart successfully!`,
          product: createdCart
        }
      } catch (error) {
        throw new HttpException({ message: error.errmsg },
          HttpStatus.BAD_REQUEST,
        );
      }

    }
    else {
      //uppdate the product
      const cartCountItem = userProductsInCart.count;
      const updatedCartDto = {
        count: createCartDto.count + cartCountItem,
      }

      try {
        var udpatedCart = await this.cartModel
          .updateOne({ user_id: createCartDto.user_id, product_id: createCartDto.product_id }, { $set: updatedCartDto })
          .exec();
        return {
          message: `Product has been updated in cart successfully!`,
          product: udpatedCart
        }
      } catch (error) {
        throw new HttpException({ message: error.errmsg },
          HttpStatus.BAD_REQUEST,
        );
      }

    }
  }

  async findByUserId(id: any): Promise<any> {

    const products = await this.cartModel
      .find({ user_id: id })
      .populate('product_id', 'name description price category')
      .lean()
      .exec();

    return products;

  }

  async updateCart(products, userid) {

    try {
      const updateOperations = products.map((updateCartItem) => ({
        updateOne: {
          filter: { _id: updateCartItem.id, user_id: userid },
          update: { $set: { count: updateCartItem.count } }
        }
      }));

      await this.cartModel.bulkWrite(updateOperations);

      return {
        message: `Cart Items has been updated`,
      }
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }




  }

  async deleteCart(cartid, userid) {

    try {


      await this.cartModel.deleteOne({
        user_id: userid,  // Replace with the actual user ID
        _id: cartid       // Replace with the actual cart item ID
      });

      return {
        message: `Cart Items has been removed`,
      }
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }

  }

}
