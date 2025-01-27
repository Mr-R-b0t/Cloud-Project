// CreatePropertyDto: Data Transfer Object for creating a property
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  status: string; // e.g., funding, funded

  @IsNotEmpty()
  @IsDateString()
  fundingDeadline: string;
}

// UpdatePropertyDto: Data Transfer Object for updating a property
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
