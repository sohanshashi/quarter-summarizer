import { Module } from '@nestjs/common';

import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { GithubHttpService } from './github_http.service';
import { PromptService } from 'src/prompts/prompt.service';

@Module({
  imports: [],
  controllers: [SummaryController],
  providers: [SummaryService, GithubHttpService, PromptService],
})
export class SummaryModule {}
