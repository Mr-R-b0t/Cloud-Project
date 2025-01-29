import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentEntity } from '../entity/investments.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../controller/dto/create-investement.dto';
import axios from 'axios';

@Injectable()
export class InvestmentsService {
    private readonly USER_SERVICE_URL = 'http://localhost:3001/users';

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

    private async getWalletBalance(userId: string): Promise<number> {
        const response = await axios.get(`${this.USER_SERVICE_URL}/wallet/balance/${userId}`);
        return response.data;
    }

    private async updateWalletBalance(userId: string, amount: number): Promise<number> {
        const response = await axios.patch(
            `${this.USER_SERVICE_URL}/wallet/update/${userId}`,
            { amount }
        );
        return response.data;
    }

    async investInProperty(userId: string, propertyId: string, amount: number) {

        const walletBalance = await this.getWalletBalance(userId);
        if (walletBalance < amount) {
            throw new ConflictException('Insufficient balance in wallet');
        }

        await this.updateWalletBalance(userId, -amount);

        const investment = this.investmentRepository.create({ userId, propertyId, amount });
        return await this.investmentRepository.save(investment);
    }

    async refundInvestment(userId: string, propertyId: string) {

        const investments = await this.investmentRepository.find({ where: { userId, propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this user and property');
        }

        const totalRefund = investments.reduce((sum, investment) => sum + investment.amount, 0);

        await this.updateWalletBalance(userId, totalRefund);

        await this.investmentRepository.remove(investments);
    }

    async distributeRentalIncome(propertyId: string, incomeAmount: number) {
        const investments = await this.investmentRepository.find({ where: { propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this property');
        }

        for (const investment of investments) {
            const userIncome = (investment.amount / incomeAmount) * incomeAmount;
            await this.updateWalletBalance(investment.userId, userIncome);
        }
    }
}
