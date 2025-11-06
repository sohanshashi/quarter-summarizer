import { Controller, Get } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { GithubHttpService } from './github_http.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  async getSummary() {
    return 'Summary';
  }
}
