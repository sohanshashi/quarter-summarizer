import { Module } from '@nestjs/common';

import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { GithubHttpService } from './github_http.service';

@Module({
  imports: [],
  controllers: [SummaryController],
  providers: [SummaryService, GithubHttpService],
})
export class SummaryModule {}
