import { Module } from '@nestjs/common';

import { SummaryController } from './summary.controller';
import { GithubHttpService } from './services/github_http.service';
import { PromptService } from 'src/prompts/prompt.service';
import { AiSummarizerService } from './services/ai_summarizer.service';

@Module({
  imports: [],
  controllers: [SummaryController],
  providers: [GithubHttpService, PromptService, AiSummarizerService],
})
export class SummaryModule {}
