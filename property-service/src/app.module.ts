import { Module } from '@nestjs/common';
import { PropertyModule } from './properties/properties.module';

@Module({
  imports: [PropertyModule],
})
export class AppModule {}
