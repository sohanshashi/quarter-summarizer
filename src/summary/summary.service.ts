import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GithubHttpService } from './github_http.service';

type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

@Injectable()
export class SummaryService {
  constructor(private readonly githubHttpService: GithubHttpService) {}

  async getSummary({
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

    try {
      const pullRequests = await this.githubHttpService.getPullRequests(query);
    } catch (err) {
      // TODO: handle this properly
      console.log('Error getting summary', err);
    }
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
