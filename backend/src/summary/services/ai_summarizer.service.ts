import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { LLM_CONSTANTS } from 'src/config/constants';
import { PromptService } from 'src/prompts/prompt.service';
import { PullRequest } from '../structures/PullRequest';

@Injectable()
export class AiSummarizerService {
  private client: OpenAI;
  constructor(private readonly promptService: PromptService) {
    this.initializeClient();
  }

  async getAiSummary(pullRequests: PullRequest[], model: string) {
    const prompt = this.promptService.render(
      LLM_CONSTANTS.PROMPT_TEMPLATE_FILE,
      {
        pr_titles: pullRequests.map((pr) => pr.title),
        include_skills: true,
        tone: 'professional',
      },
    );

    const stream = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    return stream;
  }

  private initializeClient() {
    this.client = new OpenAI({
      apiKey: 'ollama',
      baseURL: LLM_CONSTANTS.BASE_URL,
      maxRetries: LLM_CONSTANTS.MAX_RETRIES,
      timeout: LLM_CONSTANTS.TIMEOUT,
    });
  }
}
