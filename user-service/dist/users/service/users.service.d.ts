import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { WalletDto } from "../controller/dto/wallet.dto";
import { UserDto } from '../controller/dto/user.dto';
export declare class UsersService {
    private readonly userRepo;
    private readonly walletRepo;
    constructor(userRepo: Repository<UserEntity>, walletRepo: Repository<WalletDto>);
    private userEntityToDto;
    getMe(id: string): Promise<UserDto>;
    deleteMe(id: string): Promise<boolean>;
    updateMe(id: string, updateData: Partial<UserEntity>): Promise<UserDto>;
    createUser(user: Partial<UserEntity>): Promise<string>;
    getUserById(id: string): Promise<UserDto>;
    updateProfile(id: string, updateData: Partial<UserEntity>): Promise<UserDto>;
    updateWalletBalance(id: string, amount: number): Promise<number>;
    getWalletBalance(id: string): Promise<number>;
    updateUserRole(id: string, role: string): Promise<UserDto>;
    deleteUser(id: string): Promise<boolean>;
    getUsers(): Promise<UserEntity[]>;
}
