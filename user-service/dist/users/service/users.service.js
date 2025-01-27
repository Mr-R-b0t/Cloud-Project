"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const wallet_dto_1 = require("../controller/dto/wallet.dto");
const user_dto_1 = require("../controller/dto/user.dto");
let UsersService = class UsersService {
    constructor(userRepo, walletRepo) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
    }
    userEntityToDto(user) {
        const userDto = new user_dto_1.UserDto();
        userDto.id = user.id;
        userDto.email = user.email;
        userDto.firstname = user.firstname;
        userDto.lastname = user.lastname;
        userDto.role = user.role;
        return userDto;
    }
    async getMe(id) {
        return this.userEntityToDto(await this.getUserById(id));
    }
    async deleteMe(id) {
        return this.deleteUser(id);
    }
    async updateMe(id, updateData) {
        return this.userEntityToDto(await this.updateProfile(id, updateData));
    }
    async createUser(user) {
        const createdUser = await this.userRepo.save(user);
        const wallet = new wallet_dto_1.WalletDto();
        wallet.balance = 0;
        wallet.userId = createdUser.id;
        await this.walletRepo.save(wallet);
        return createdUser.id;
    }
    async getUserById(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return this.userEntityToDto(user);
    }
    async updateProfile(id, updateData) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.update(id, updateData);
        return this.getUserById(id);
    }
    async updateWalletBalance(id, amount) {
        const wallet = await this.walletRepo.findOne({ where: { userId: id } });
        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }
        wallet.balance += amount;
        await this.walletRepo.save(wallet);
        return wallet.balance;
    }
    async getWalletBalance(id) {
        const wallet = await this.walletRepo.findOne({ where: { userId: id } });
        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }
        return wallet.balance;
    }
    async updateUserRole(id, role) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        user.role = role;
        await this.userRepo.save(user);
        return this.userEntityToDto(user);
    }
    async deleteUser(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.delete({ id });
        return true;
    }
    async getUsers() {
        return this.userRepo.find();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_dto_1.WalletDto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map