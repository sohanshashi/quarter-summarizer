import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SummaryService {
  constructor(private readonly configService: ConfigService) {}

  getSummary() {}
}
