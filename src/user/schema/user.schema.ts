import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @Prop({ isRequired: true })
    firstname: string;

    @Prop({ isRequired: true })
    lastname: string;

    @Prop({ isRequired: true, unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ default: 'subscriber' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
