import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { LLM_CONSTANTS } from 'src/config/constants';
import { PromptService } from 'src/prompts/prompt.service';
import { PullRequest } from './structures/PullRequest';

@Injectable()
export class AiSummarizerService {
  private client: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    private readonly promptService: PromptService,
  ) {
    this.initializeClient();
  }

  async getAiSummary(pullRequests: PullRequest[]) {
    const prompt = this.promptService.render(
      LLM_CONSTANTS.PROMPT_TEMPLATE_FILE,
      {
        pr_titles: pullRequests.map((pr) => pr.title),
        include_skills: true,
        tone: 'professional',
      },
    );

    const response = await this.client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
    });

    console.log(response.choices[0].message);
  }

  private initializeClient() {
    this.client = new OpenAI({
      apiKey: this.configService.get('GROQ_API_KEY'),
      baseURL: LLM_CONSTANTS.BASE_URL,
      maxRetries: LLM_CONSTANTS.MAX_RETRIES,
      timeout: LLM_CONSTANTS.TIMEOUT,
    });
  }
}
