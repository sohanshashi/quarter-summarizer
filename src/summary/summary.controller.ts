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
      startDate: '2025-10-01',
      endDate: '2025-12-31',
    });

    await this.summaryService.getAiSummary(pullRequests);

    return 'success';
  }
}
