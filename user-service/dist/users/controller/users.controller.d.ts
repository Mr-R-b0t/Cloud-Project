import { UsersService } from "../service/users.service";
import { UserEntity } from "../entity/user.entity";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getMe(id: string): Promise<import("./dto/user.dto").UserDto>;
    deleteMe(id: string): Promise<boolean>;
    updateMe(id: string, updateData: Partial<UserEntity>): Promise<import("./dto/user.dto").UserDto>;
    createUser(user: Partial<UserEntity>): Promise<string>;
    getUserById(id: string): Promise<import("./dto/user.dto").UserDto>;
    updateProfile(id: string, updateData: Partial<UserEntity>): Promise<import("./dto/user.dto").UserDto>;
    updateWalletBalance(id: string, amount: number): Promise<number>;
    getWalletBalance(id: string): Promise<number>;
    updateUserRole(id: string, role: string): Promise<import("./dto/user.dto").UserDto>;
}
