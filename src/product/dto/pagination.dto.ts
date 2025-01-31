import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsString()
    page?: string; // MongoDB ObjectId or unique field

    @IsOptional()
    @IsNumberString()
    limit?: number; // Maximum number of items to fetch

    @IsOptional()
    @IsString()
    search?: string; // search

    @IsOptional()
    @IsString()
    sortby?: string; // sortby


}