import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentEntity } from '../entity/investments.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../controller/dto/create-investement.dto';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(InvestmentEntity) private readonly investmentRepository: Repository<InvestmentEntity>,
    ) {}

    async create(createInvestmentDto: CreateInvestmentDto) {
        try {
            const investment = this.investmentRepository.create(createInvestmentDto);
            return await this.investmentRepository.save(investment);
        } catch (error) {
            if (error.code === '23505') { // Unique violation error code for PostgreSQL
                throw new ConflictException('Investment for this user and property already exists');
            }
            throw error;
        }
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
