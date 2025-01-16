import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {

    @Prop({ type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', isRequired: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', isRequired: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ isRequired: true, default: 1 })
    count: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart);
