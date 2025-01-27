export declare class CreatePropertyDto {
    name: string;
    type: string;
    price: number;
    status: string;
    fundingDeadline: string;
}
declare const UpdatePropertyDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePropertyDto>>;
export declare class UpdatePropertyDto extends UpdatePropertyDto_base {
}
export {};
