import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateMailDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  object: string;

  @IsString()
  body: string;
}
