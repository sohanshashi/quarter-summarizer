import { Module } from '@nestjs/common';

import { SummaryController } from './summary.controller';
import { GithubService } from './services/github.service';
import { PromptService } from 'src/prompts/prompt.service';
import { AiSummarizerService } from './services/ai_summarizer.service';

@Module({
  imports: [],
  controllers: [SummaryController],
  providers: [GithubService, PromptService, AiSummarizerService],
})
export class SummaryModule {}
