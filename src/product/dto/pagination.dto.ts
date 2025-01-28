import { IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsString()
    cursor?: string; // MongoDB ObjectId or unique field

    @IsOptional()
    @IsNumberString()
    limit?: number; // Maximum number of items to fetch

    @IsOptional()
    @IsString()
    direction?: string; // 'next' | 'prev' 

}