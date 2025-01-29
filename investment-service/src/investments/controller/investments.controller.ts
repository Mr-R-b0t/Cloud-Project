import { Controller, Get, Param, Patch, Delete, Body, Post } from '@nestjs/common';
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

    @Patch(':id')
    async updateInvestment(@Param('id') id: string, @Body() updateInvestmentDto: Partial<CreateInvestmentDto>) {
        return this.investmentsService.updateInvestment(id, updateInvestmentDto);
    }

    @Delete(':id')
    async removeInvestment(@Param('id') id: string) {
        return this.investmentsService.removeInvestment(id);
    }
}
