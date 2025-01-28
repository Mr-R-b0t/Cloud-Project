import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(500)
  amount: number;

  @IsString()
  paymentMethod: string;
}
