import { IsNotEmpty, IsMongoId, IsInt, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateWishlistDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id: mongoose.Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    product_id: mongoose.Types.ObjectId;

}
