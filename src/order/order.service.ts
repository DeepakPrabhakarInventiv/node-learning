import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUserId): Promise<any> {

    //products in cart
    const cartItems = await this.cartService.find(currentUserId);
    const items = [];
    let totalAmount = 0;

    //Now check products available for purchase
    for (const cartItem of cartItems) {

      const product = cartItem.product_id;

      // Validate product existence
      const productData = await this.productService.findOne(product._id.toString());
      if (!productData) {
        throw new HttpException({ message: 'Product not found' }, HttpStatus.BAD_REQUEST);
      }

      //product count validation
      if (cartItem.count > productData.quantity) {
        throw new HttpException({ message: `Product *${product.name}* not in stock for this ${cartItem.count} quantity, Please reduce items from cart or try again later` }, HttpStatus.BAD_REQUEST);
      }

      //Items Array
      items.push({
        product_id: product._id,
        quantity: cartItem.count,
        price: productData.price
      });

      //Total Amount add
      totalAmount += productData.price * parseInt(cartItem.count);

    }

    //Generate Order
    const orderData = {
      user_id: currentUserId,
      status: 'pending',
      address: createOrderDto.address,
      items: items,
      totalAmount: totalAmount,
    };

    try {

      const createdOrder = new this.orderModel(orderData);
      await createdOrder.save();

      //Update Stock
      for (const productItem of items) {
        //update stock
        const updateStock = await this.productService.updateStock(productItem.product_id, productItem.quantity);
      }

      //remove from cart
      for (const cartItem of cartItems) {
        const deleteFromCart = await this.cartService.deleteCart(cartItem._id.toString(), currentUserId);
      }

      //Remove cache 
      await this.redisService.delCache(`orders_${currentUserId}_data`);

      return {
        message: 'Order has been created successfully!',
        orderid: createdOrder._id,
        order: createdOrder
      }

    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }

  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {

    try {
      const orderData = this.orderModel
        .findById(id)
        .populate({
          path: 'items.product_id', // Populate the product_id inside items array
          select: 'name description price category', // Specify fields to retrieve
        })
        .lean()
        .exec();

      return orderData;
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }

  }

  async orderByUserId(id: string) {
    try {

      const cacheData = await this.redisService.getCache(`orders_${id}_data`);
      if (cacheData) {
        console.log("Orders Cache from Redis");
        return JSON.parse(cacheData);
      }

      const orderData = await this.orderModel
        .find({ user_id: id })
        .populate({
          path: 'items.product_id', // Populate the product_id inside items array
          select: 'name description price category', // Specify fields to retrieve
        })
        .lean()
        .exec();

      //add in redis
      await this.redisService.setCache(`orders_${id}_data`, JSON.stringify(orderData), 3600);
      console.log("Orders Cache from Database");

      return orderData;
    } catch (error) {
      throw new HttpException({ message: error.errmsg },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
