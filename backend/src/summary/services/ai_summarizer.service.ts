import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { LLM_CONSTANTS } from 'src/config/constants';
import { PromptService } from 'src/prompts/prompt.service';
import { PullRequest } from '../structures/PullRequest';
import { LLMClassifiedPullRequest } from 'src/types';

type SummarizationContext = {
  startDate: string;
  endDate: string;
};

@Injectable()
export class AiSummarizerService {
  private client: OpenAI;
  constructor(
    private readonly promptService: PromptService,
    private readonly configService: ConfigService,
  ) {
    this.initializeClient();
  }

  async getAvailableModels() {
    const response = await this.client.models.list();
    return response.data;
  }

  async getAiSummary(
    pullRequests: PullRequest[],
    model: string,
    context: SummarizationContext,
  ) {
    const classifiedPrsResponse = await this.classifyPRs(pullRequests, model);
    const classifiedPrs = JSON.parse(
      // can't trust the LLM. No matter how many times I ask it to not include json fences (```json)
      // it always fucking does anyway!!!
      this.stripJsonFences(
        classifiedPrsResponse.choices[0].message.content ?? '[]',
      ),
    ) as LLMClassifiedPullRequest[];

    if (classifiedPrs.length <= 0) {
      return Promise.reject(new Error('No summary available'));
    }

    return this.streamOverallPRSummary(classifiedPrs, model, context);
  }

  private stripJsonFences(content: string): string {
    return content
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '');
  }

  private async streamOverallPRSummary(
    classifiedPrs: LLMClassifiedPullRequest[],
    model: string,
    context: SummarizationContext,
  ) {
    const systemPrompt = this.promptService.render(
      LLM_CONSTANTS.SUMMARIZATION_SYSTEM_TEMPLATE,
    );
    const userPrompt = this.promptService.render(
      LLM_CONSTANTS.SUMMARIZATION_USER_TEMPLATE,
      {
        classifiedPrs,
        ...context,
        developerRole:
          this.configService.get<string>('DEVELOPER_ROLE') ?? 'Not specified',
      },
    );

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
    });

    return stream;
  }

  private async classifyPRs(
    pullRequests: PullRequest[],
    model: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const systemPrompt = this.promptService.render(
      LLM_CONSTANTS.CLASSIFICATION_SYSTEM_TEMPLATE,
    );
    const userPrompt = this.promptService.render(
      LLM_CONSTANTS.CLASSIFICATION_USER_TEMPLATE,
      { pullRequests: pullRequests.map((pr) => pr.toJSON()) },
    );

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
    });

    return response;
  }

  private initializeClient() {
    this.client = new OpenAI({
      apiKey:
        this.configService.get('LLM_API_KEY') || LLM_CONSTANTS.OLLAMA_API_KEY,
      baseURL:
        this.configService.get('LLM_BASE_URL') || LLM_CONSTANTS.OLLAMA_BASE_URL,
      maxRetries: LLM_CONSTANTS.MAX_RETRIES,
      timeout: LLM_CONSTANTS.TIMEOUT,
    });
  }
}
