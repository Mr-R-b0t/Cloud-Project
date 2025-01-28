import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { PropertyModule } from './properties/module/properties.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), PropertyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
