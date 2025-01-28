import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './controller/payments.controller';
import { PaymentService } from './service/payments.service';
import { Payment } from './entity/payments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', 
        url: configService.get('TYPEORM_URI'),
        entities: [Payment],
        synchronize: true, 
        ssl: {
          rejectUnauthorized: false 
        }
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}