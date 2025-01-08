import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentsModule } from './investments/investments.module';
import { InvestmentsController } from './investments/investments.controller';
import { InvestmentsService } from './investments/investments.service';

@Module({
  imports: [InvestmentsModule],
  controllers: [AppController, InvestmentsController],
  providers: [AppService, InvestmentsService],
})
export class AppModule {}
