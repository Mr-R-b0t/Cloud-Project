import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentEntity } from './entity/investments.entity';
import { InvestmentsController } from './controller/investments.controller';
import { InvestmentsService } from './service/investments.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([InvestmentEntity]),
    ],
    controllers: [InvestmentsController],
    providers: [InvestmentsService],
})

export class InvestmentsModule {}
