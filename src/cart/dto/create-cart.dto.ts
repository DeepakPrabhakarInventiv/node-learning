import { IsNotEmpty, IsMongoId, IsInt, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCartDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id: mongoose.Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    product_id: mongoose.Types.ObjectId;

    @IsInt()
    @Min(1)
    count: number;

}
