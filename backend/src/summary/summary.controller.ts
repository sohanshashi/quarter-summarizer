import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SummaryService } from './summary.service';
import { GetSummaryQueryDto } from './dto/get_summary_query_dto';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Sse()
  getSummary(@Query() query: GetSummaryQueryDto): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      void (async () => {
        try {
          const { username, orgName, startDate, endDate, model } = query;

          const pullRequests = await this.summaryService.getPullRequests({
            username,
            orgName,
            startDate,
            endDate,
          });

          const stream = await this.summaryService.getAiSummary(
            pullRequests,
            model,
          );

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

  @Get('pullRequests')
  getPullRequests() {
    return { msg: 'pull requests' };
  }
}
