import { PropertyService } from './properties.service';
import { CreatePropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    create(createPropertyDto: CreatePropertyDto): Promise<import("./entities/property.entity").Property>;
    findAll(): Promise<import("./entities/property.entity").Property[]>;
    findOne(id: number): Promise<import("./entities/property.entity").Property>;
    update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<import("./entities/property.entity").Property>;
    remove(id: number): Promise<void>;
}
