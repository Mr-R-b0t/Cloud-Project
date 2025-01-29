import { IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsNumber()
  amount: number;

  @IsString()
  idSender: string;
  
  @IsString()
  idReceiver: string;
}
