import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GetSummaryQueryDto } from './dto/get_summary_query_dto';
import { GetSummaryParams } from 'src/types';
import { GithubService } from './services/github.service';
import { AiSummarizerService } from './services/ai_summarizer.service';

@Controller('summary')
export class SummaryController {
  constructor(
    private readonly githubService: GithubService,
    private readonly aiService: AiSummarizerService,
  ) {}

  @Sse()
  getSummary(@Query() query: GetSummaryQueryDto): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      void (async () => {
        try {
          const { username, orgName, model, startDate, endDate } = query;
          const filter = this.getFilterQuery({
            username,
            orgName,
            startDate,
            endDate,
          });

          const pullRequests = await this.githubService.getPullRequests(filter);
          const stream = await this.aiService.getAiSummary(pullRequests, model);

          for await (const chunk of stream) {
            if (chunk.choices[0].delta.content) {
              subscriber.next({
                data: {
                  content: chunk.choices[0].delta.content,
                },
              } as MessageEvent);
            }
          }

          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  @Get('pull_requests')
  async getPullRequests(@Query() query: GetSummaryQueryDto) {
    const { username, orgName, model, startDate, endDate } = query;
    const filter = this.getFilterQuery({
      username,
      orgName,
      startDate,
      endDate,
    });

    const pullRequests = await this.githubService.getPullRequests(filter);

    return { data: pullRequests, status: true };
  }

  private getFilterQuery({
    username,
    orgName,
    startDate,
    endDate,
  }: GetSummaryParams) {
    return `is:pr author:${username} is:merged merged:${startDate}..${endDate} org:${orgName}`;
  }
}
