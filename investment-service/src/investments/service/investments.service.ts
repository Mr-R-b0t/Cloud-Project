import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentEntity } from '../entity/investments.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../controller/dto/create-investement.dto';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(InvestmentEntity) private readonly investmentRepository: Repository<InvestmentEntity>,
    ) {}

    async create(createInvestmentDto: CreateInvestmentDto ){
        const investment = this.investmentRepository.create(createInvestmentDto);
        return this.investmentRepository.save(investment);
    }

    async findAllInvestments(){
        return this.investmentRepository.find();
    }

    async findInvestmentById(id: string){
        return this.investmentRepository.findOne({ where: { id } });
    }

    async findInvestmentsByUserId(userId: string) {
        return this.investmentRepository.find({ where: { userId } });
    }

    async findInvestmentsByPropertyId(propertyId: string) {
        return this.investmentRepository.find({ where: { propertyId } });
    }

    async updateInvestment(id: string, updateInvestmentDto: Partial<CreateInvestmentDto>) {
        await this.investmentRepository.update(id, updateInvestmentDto);
        return this.findInvestmentById(id);
    }

    async removeInvestment(id: string) {
        const investment = await this.findInvestmentById(id);
        if (investment) {
            await this.investmentRepository.remove(investment);
        }
        return investment;
    }
}
