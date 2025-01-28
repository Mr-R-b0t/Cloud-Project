import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentEntity } from '../entity/investments.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../controller/dto/create-investement.dto';
import { WalletService } from './wallet.service'; // Assuming a WalletService exists for wallet operations

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(InvestmentEntity) private readonly investmentRepository: Repository<InvestmentEntity>,
        private readonly walletService: WalletService, // Inject WalletService
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

    /**
     * Handle investment in a property.
     */
    async investInProperty(userId: string, propertyId: string, amount: number) {
        // Check if the user has enough balance in the wallet
        const walletBalance = await this.walletService.getWalletBalance(userId);
        if (walletBalance < amount) {
            throw new ConflictException('Insufficient balance in wallet');
        }

        // Deduct the amount from the wallet
        await this.walletService.updateWalletBalance(userId, { amount: -amount });

        // Create the investment
        const investment = this.investmentRepository.create({ userId, propertyId, amount });
        return await this.investmentRepository.save(investment);
    }

    /**
     * Refund investment if the property funding fails.
     */
    async refundInvestment(userId: string, propertyId: string) {
        const investments = await this.investmentRepository.find({ where: { userId, propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this user and property');
        }

        // Calculate the total amount to refund
        const totalRefund = investments.reduce((sum, investment) => sum + investment.amount, 0);

        // Update the wallet balance
        await this.walletService.updateWalletBalance(userId, { amount: totalRefund });

        // Remove the investments
        await this.investmentRepository.remove(investments);
    }

    /**
     * Distribute monthly rental income to investors.
     */
    async distributeRentalIncome(propertyId: string, incomeAmount: number) {
        const investments = await this.investmentRepository.find({ where: { propertyId } });
        if (!investments.length) {
            throw new NotFoundException('No investments found for this property');
        }

        // Distribute income based on investment amount
        for (const investment of investments) {
            const userIncome = (investment.amount / incomeAmount) * incomeAmount;
            await this.walletService.updateWalletBalance(investment.userId, { amount: userIncome });
        }
    }
}
