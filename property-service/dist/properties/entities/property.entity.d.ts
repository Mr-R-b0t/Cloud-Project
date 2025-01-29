import { Funding } from './funding.entity';
export declare class Property {
    id: number;
    name: string;
    type: string;
    price: number;
    status: string;
    fundingDeadline: Date;
    fundings: Funding[];
}
