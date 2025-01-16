import { IsNumber, IsString } from "class-validator";

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
