import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './schema/wishlist.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WishlistService {

  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>) { }

  async create(createWishlistDto: CreateWishlistDto) {

    // Validate product existence in cart
    const userProductsInWishlist = await this.wishlistModel.findOne({ user_id: createWishlistDto.user_id, product_id: createWishlistDto.product_id }).exec();

    if (!userProductsInWishlist) {
      //insert the product
      try {
        const createdCart = await new this.wishlistModel(createWishlistDto).save();
        return {
          message: `Product has been added in wishlist successfully!`,
          product: createdCart
        }
      } catch (error) {
        throw new HttpException({ message: error.errmsg },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    throw new HttpException({ message: "Product is already in your wishlist" },
      HttpStatus.BAD_REQUEST,
    );

  }

  async findByUserId(id: any): Promise<any> {

    const products = await this.wishlistModel
      .find({ user_id: id })
      .populate('product_id', 'name description price category')
      .lean()
      .exec();

    return products;

  }

  findAll() {
    return `This action returns all wishlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  async deleteWishlist(wishlistid, userid) {

    try {


      await this.wishlistModel.deleteOne({
        user_id: userid,  // Replace with the actual user ID
        _id: wishlistid       // Replace with the actual cart item ID
      });

      return {
        message: `Wishlist Items has been removed`,
      }
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }

  }

  async deleteWishlistByPid(product_id, user_id) {
    try {
      await this.wishlistModel.deleteOne({
        user_id: user_id,  // Replace with the actual user ID
        product_id: product_id       // Replace with the actual cart item ID
      });

      return {
        message: `Wishlist Items has been removed`,
      }
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async countWishlist(id: any) {
    return this.wishlistModel.countDocuments({ user_id: id }).exec();
  }

}
