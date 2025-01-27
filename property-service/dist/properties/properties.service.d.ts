import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/property.dto';
import { Property } from './entities/property.entity';
export declare class PropertyService {
    private readonly propertyRepository;
    constructor(propertyRepository: Repository<Property>);
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    findAll(): Promise<Property[]>;
    findOne(id: number): Promise<Property>;
    update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: number): Promise<void>;
}
