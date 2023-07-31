import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    minLength: 1,
    description: 'Product title',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'lorem ipsum dolor sit amet consectetur',
    description: 'Product description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 't_shirt',
    description: 'Product slug',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product sizes',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: ['men', 'women', 'kid', 'unisex'],
    description: 'Product gender',
    default: [],
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    example: ['https://example.com/image1', 'https://example.com/image2'],
    description: 'Product images',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
