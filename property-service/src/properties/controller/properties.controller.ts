import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
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

  @Post(':id/fund')
  async fundProperty(
    @Param('id') id: number,
    @Body('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.propertyService.fundProperty(id, userId, amount);
  }

  @Get(':id/remaining')
  async getRemainingInvestment(@Param('id') id: number) {
    return this.propertyService.getRemainingInvestment(id);
  }
}
