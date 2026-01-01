import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';

import { PullRequest } from '../structures/PullRequest';
import { PullRequestData } from 'src/types';

@Injectable()
export class GithubService {
  private octokit: Octokit;

  constructor(private readonly configService: ConfigService) {
    this.initializeClient();
  }

  public async getPullRequests(filter: string) {
    const pullRequests: PullRequest[] = [];
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.search.issuesAndPullRequests,
      {
        per_page: 100,
        q: filter,
      },
    );

    for await (const { data: items } of iterator) {
      pullRequests.push(
        ...items.map((item) =>
          this.createApplicationPullRequest({
            title: item.title,
            url: item.pull_request?.url,
            closedAt: item.closed_at,
            mergedAt: item.pull_request?.merged_at,
          }),
        ),
      );
    }

    return pullRequests;
  }

  createApplicationPullRequest(data: PullRequestData) {
    return new PullRequest(data);
  }

  private initializeClient() {
    this.octokit = new Octokit({
      auth: this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN') as string,
    });
  }
}
