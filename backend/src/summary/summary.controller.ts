import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GetSummaryQueryDto } from './dto/get_summary_query_dto';
import { GetSummaryParams } from 'src/types';
import { GithubHttpService } from './services/github_http.service';
import { AiSummarizerService } from './services/ai_summarizer.service';

@Controller('summary')
export class SummaryController {
  constructor(
    private readonly githubService: GithubHttpService,
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
  getPullRequests() {
    return { msg: 'pull requests' };
  }

  private getFilterQuery({
    username,
    orgName,
    startDate,
    endDate,
  }: GetSummaryParams) {
    const rawQuery = `is:pr author:${username} is:merged merged:${startDate}..${endDate} org:${orgName}`;
    return encodeURIComponent(rawQuery);
  }
}
