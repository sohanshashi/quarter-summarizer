import { Controller, Get, Query } from '@nestjs/common';

import { SummaryService } from './summary.service';
import { GetSummaryQueryDto } from './dto/get_summary_query_dto';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummary(@Query() query: GetSummaryQueryDto) {
    const { username, orgName, startDate, endDate, model } = query;

    const pullRequests = await this.summaryService.getPullRequests({
      username,
      orgName,
      startDate,
      endDate: endDate || new Date().toISOString().split('T')[0],
    });

    const stream = await this.summaryService.getAiSummary(pullRequests, model);

    for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }

    return pullRequests;
  }
}
