import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId; // Reference to the User

    @Prop([
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }, // Price of the product at the time of order
        },
    ])
    items: {
        product_id: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
    }[]; // Array of ordered products

    @Prop({ required: true, default: 0 })
    totalAmount: number; // Total cost of the order

    @Prop({ type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
    status: string; // Order status

    @Prop({ type: String, required: true })
    address: string; // Shipping address

    @Prop({ type: Date, required: false })
    deliveredAt?: Date; // Delivery date (optional)

}

export const OrderSchema = SchemaFactory.createForClass(Order);
