import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PropertyService } from '../service/properties.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
} from '../controller/dto/property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  async findAll() {
    return this.propertyService.findAll();
  }

  @Get('opened')
  async findAllOpenedForFunding() {
    return this.propertyService.findAllOpenedForFunding();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.propertyService.remove(id);
  }

  @Post('/fund/:id')
  async fundProperty(
    @Param('id') id: number,
    @Body('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.propertyService.fundProperty(id, userId, amount);
  }

  @Get('/remaining/:id')
  async getRemainingInvestment(@Param('id') id: number) {
    return this.propertyService.getRemainingInvestment(id);
  }

  @Patch('/funding/update-user')
  async updateFundingUser(
    @Body() body: { propertyId: number; userId: string; newUserId: string },
  ) {
    const { propertyId, userId, newUserId } = body;

    if (!propertyId || !userId || !newUserId) {
      throw new NotFoundException(
        'propertyId, userId, and newUserId must be provided',
      );
    }

    return this.propertyService.updateFundingUser(
      propertyId,
      userId,
      newUserId,
    );
  }
}
