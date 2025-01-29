import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
} from '../controller/dto/property.dto';
import { Property } from '../entities/property.entity';
import { Funding } from '../entities/funding.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      fundingDeadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      fundings: [],
    });
    return this.propertyRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({ relations: ['fundings'] });
  }

  async findAllOpenedForFunding(): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { status: 'funding' },
      take: 6,
      relations: ['fundings'],
    });
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['fundings'],
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id);
    const updatedProperty = { ...property, ...updatePropertyDto };
    return this.propertyRepository.save(updatedProperty);
  }

  async remove(id: number): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);
  }

  async fundProperty(id: number, userId: string, amount: number): Promise<any> {
    const property = await this.findOne(id);

    if (property.status !== 'funding') {
      throw new ConflictException('Property is not open for funding');
    }

    // Check if funding deadline has passed
    const deadline = new Date(property.fundingDeadline);
    if (deadline < new Date()) {
      // Refund investors and change status back to "open to funding"
      const walletServiceUrl = this.configService.get<string>('localhost:3003');
      await this.httpService
        .post(`${walletServiceUrl}/refund`, { propertyId: id })
        .toPromise();
      property.status = 'open to funding';
      await this.propertyRepository.save(property);
      throw new ConflictException(
        'Funding deadline has passed, investors have been refunded',
      );
    }

    const funding = this.fundingRepository.create({ userId, amount });
    property.fundings.push(await this.fundingRepository.save(funding));

    return this.propertyRepository.save(property);
  }
}
