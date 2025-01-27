import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module'
import {UsersModule} from "./users/users.module";
import {GatewayModule} from "./gateway/gateway.module";


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    UsersModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
