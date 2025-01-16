import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {

    @Prop({ type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @Prop({ isRequired: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop({ isRequired: true })
    category: string;

    @Prop()
    quantity: number;

    @Prop({ default: 'simple' })
    type: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
