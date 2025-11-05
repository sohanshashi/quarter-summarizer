import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';

@Module({
  imports: [],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
