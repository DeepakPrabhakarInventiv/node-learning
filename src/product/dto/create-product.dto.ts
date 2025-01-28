import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";


export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    category: string;

    @IsNumber()
    quantity: number;

    @IsString()
    type: string;

}
