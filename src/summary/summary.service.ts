import { Injectable } from '@nestjs/common';

import { GithubHttpService } from './github_http.service';
import { GetSummaryParams } from 'src/types';

@Injectable()
export class SummaryService {
  constructor(private readonly githubHttpService: GithubHttpService) {}

  async getPullRequests({
    username,
    orgName,
    startDate,
    endDate,
  }: GetSummaryParams) {
    const query = this.getQueryString({
      username,
      orgName,
      startDate,
      endDate,
    });

    return this.githubHttpService.getPullRequests(query);
  }

  private getQueryString({
    username,
    orgName,
    startDate,
    endDate,
  }: GetSummaryParams) {
    const rawQuery = `is:pr author:${username} is:merged merged:${startDate}..${endDate} org:${orgName}`;
    return encodeURIComponent(rawQuery);
  }
}

/**
 * Query Requirements
 * - is: pull request pointing to the main branch
 * - created by the current user
 * - status is merged
 * - merged between 2 dates
 * - belongs to orgname
 */

/**
 * year
 * q 1-4
 * org
 * your username
 * your orgname
 */
