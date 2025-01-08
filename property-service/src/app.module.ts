import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { PropertiesController } from './properties/properties.controller';
import { PropertiesService } from './properties/properties.service';

@Module({
  imports: [PropertiesModule],
  controllers: [AppController, PropertiesController],
  providers: [AppService, PropertiesService],
})
export class AppModule {}
