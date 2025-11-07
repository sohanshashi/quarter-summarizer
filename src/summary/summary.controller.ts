import { Controller, Get } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummary() {
    const pullRequests = await this.summaryService.getPullRequests({
      username: 'sohanshashi',
      orgName: 'interviewstreet',
      startDate: '2025-09-01',
      endDate: '2025-11-07',
    });

    return pullRequests;
  }
}
