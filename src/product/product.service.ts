import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>, private readonly redisService: RedisService) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const createdProduct = new this.productModel(createProductDto);
      await createdProduct.save();

      //delete redis
      await this.redisService.delCache(`products_data`);

      return {
        message: 'Product has been added successfully!',
        product: createdProduct
      }
    }
    catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const direction = paginationDto.direction || 'next';
    const limit = paginationDto.limit || 3;
    const cursor = paginationDto.cursor;

    const pageLimit = Number(limit); // Default limit of 3 items per page

    const query: any = {};
    if (cursor) {
      query._id = direction === 'prev' ? { $lt: cursor } : { $gt: cursor };
    }

    // Determine sorting order
    const sortOrder = direction === 'prev' ? -1 : 1; // Ascending (1) or Descending (-1)
    const sort: Record<string, SortOrder> = { _id: sortOrder };

    const products = await this.productModel
      .find(query)
      .limit(pageLimit + 1)
      .sort(sort)
      .exec();

    const hasMore = products.length > pageLimit ? true : false;
    if (hasMore == true) {
      products.pop();
    }

    if (direction === 'prev') {
      products.reverse();
    }

    let nextCursor = hasMore == true && direction === 'next' ? products.at(-1)._id : null;
    nextCursor = direction === 'prev' ? products.at(-1)._id : nextCursor;

    let prevCursor = products.at(0)._id;
    if (!cursor) {
      prevCursor = null;
    }
    if (hasMore == false && direction == 'prev') {
      prevCursor = null;
    }

    return { products, prevCursor, nextCursor };

  }



  findOne(id: string) {

    try {
      return this.productModel.findById(id).exec();
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async updateStock(id: string, quantity: number) {
    try {
      // Use $inc to decrement the stock quantity
      const result = await this.productModel.updateOne(
        { _id: id, quantity: { $gte: quantity } },  // Ensure there's enough stock
        { $inc: { quantity: -quantity } }            // Deduct the quantity
      ).exec();

      // If no document was updated, it could mean the product doesn't exist or not enough stock
      if (result.modifiedCount === 0) {
        throw new Error('Product not found or insufficient stock.');
      }

      // Fetch the updated product (optional)
      const updatedProduct = await this.productModel.findById(id).exec();

      return {
        message: 'Product stock has been updated successfully.',
        product: updatedProduct,
      };
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to update product stock.' },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
