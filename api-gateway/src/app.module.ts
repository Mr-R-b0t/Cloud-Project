import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    AuthModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
