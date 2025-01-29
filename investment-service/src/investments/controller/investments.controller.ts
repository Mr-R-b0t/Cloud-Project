import { Controller, Get, Param, Delete, Patch, Body, Post } from '@nestjs/common';
import { InvestmentsService } from '../service/investments.service';
import { CreateInvestmentDto } from './dto/create-investement.dto';

@Controller('investments')
export class InvestmentsController {
    constructor(
        private readonly investmentsService: InvestmentsService,
    ) {}

    @Post('create')
    async create(@Body() createInvestmentDto: CreateInvestmentDto) {
        return this.investmentsService.create(createInvestmentDto);
    }

    @Get('get/all')
    async findAllInvestments() {
        return this.investmentsService.findAllInvestments();
    }

    @Get(':id')
    async findInvestmentById(@Param('id') id: string) {
        return this.investmentsService.findInvestmentById(id);
    }

    @Get('user/:userId')
    async findInvestmentsByUserId(@Param('userId') userId: string) {
        return this.investmentsService.findInvestmentsByUserId(userId);
    }

    @Get('property/:propertyId')
    async findInvestmentsByPropertyId(@Param('propertyId') propertyId: string) {
        return this.investmentsService.findInvestmentsByPropertyId(propertyId);
    }

    @Delete(':id')
    async removeInvestment(@Param('id') id: string) {
        return this.investmentsService.removeInvestment(id);
    }

    @Post('invest')
    async investInProperty(
        @Body('userId') userId: string,
        @Body('propertyId') propertyId: string,
        @Body('amount') amount: number,
    ) {
        return this.investmentsService.investInProperty(userId, propertyId, amount);
    }

    @Post('refund')
    async refundInvestment(
        @Body('propertyId') propertyId: string,
    ) {
        return this.investmentsService.refundInvestment(propertyId);
    }

    @Post('distribute-income')
    async distributeRentalIncome(
        @Body('propertyId') propertyId: string,
    ) {
        return this.investmentsService.distributeRentalIncome(propertyId);
    }  

    @Patch('sell')
    async sellInvestment(
        @Body('propertyId') propertyId: string,
        @Body('userId') userId: string,
        @Body('newUserId') newUserId: string,
    ) {
        return this.investmentsService.sellInvestment(userId, propertyId, newUserId);
    }

    
}
