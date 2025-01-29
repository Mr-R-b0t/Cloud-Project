import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentEntity } from '../entity/investments.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../controller/dto/create-investement.dto';
import axios from 'axios';

@Injectable()
export class InvestmentsService {
    private readonly USER_SERVICE_URL = 'http://localhost:3001/users';
    private readonly PROPERTY_SERVICE_URL = 'http://localhost:3002/properties';

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
        console.log(amount)
        const response = await axios.patch(
            `${this.USER_SERVICE_URL}/wallet/update/${userId}`,
            { amount: amount }
        );
        return response.data;
    }

    private async getRemainingInvestmentBalance(propertyId: string): Promise<number> {
        const response = await axios.get(`${this.PROPERTY_SERVICE_URL}/remaining/${propertyId}`);
        return response.data.remaining;
    };

    async investInProperty(userId: string, propertyId: string, amount: number) {
        const remainingBalance = await this.getRemainingInvestmentBalance(propertyId);
        if (remainingBalance < amount) {
            throw new ConflictException('Insufficient balance in property');
        }
        const walletBalance = await this.getWalletBalance(userId);
        if (walletBalance < amount ) {
            throw new ConflictException('Insufficient balance in wallet');
        }

        await this.updateWalletBalance(userId, -amount);
        const investment = this.investmentRepository.create({ userId, propertyId, amount });
        
        await axios.post(`${this.PROPERTY_SERVICE_URL}/fund/${propertyId}`, { userId: userId, amount: amount });
        
        return await this.investmentRepository.save(investment);
    }

    async refundInvestment(propertyId: string) {
        const investments = await this.investmentRepository.find({ where: { propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this property');
        }
        
        for (const investment of investments) {
            await this.updateWalletBalance(investment.userId, investment.amount);
        }
        await axios.delete(`${this.PROPERTY_SERVICE_URL}/${parseInt(propertyId)}`);
        await this.investmentRepository.remove(investments);
    }

    async distributeRentalIncome(propertyId: string) {
        const investments = await this.investmentRepository.find({ where: { propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this property');
        }

        const propertyDetails = await axios.get(`${this.PROPERTY_SERVICE_URL}/${propertyId}`);
        const propertyValue = propertyDetails.data.price;
        const annualRentalRate = 0.06; // 6% annual rental income
        const annualAppreciationRate = 0.02; // 2% annual appreciation

        for (const investment of investments) {
            const sharePercentage = investment.amount / propertyValue;
            const rentalIncome = propertyValue * sharePercentage * annualRentalRate;
            const appreciationIncome = propertyValue * sharePercentage * annualAppreciationRate;
            const totalIncome = rentalIncome + appreciationIncome;

            await this.updateWalletBalance(investment.userId, totalIncome);
        }
    }
}
