import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import pLimit from 'p-limit';

import { PullRequest } from '../structures/PullRequest';
import { PullRequestData, RestReviewComment } from 'src/types';

const CONCURRENT_REVIEW_FETCHES = 10;
const PAGINATOR_ITEMS_PER_PAGE = 100;

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
        per_page: PAGINATOR_ITEMS_PER_PAGE,
        q: filter,
      },
    );

    for await (const { data: items } of iterator) {
      const limit = pLimit(CONCURRENT_REVIEW_FETCHES);
      const reviewCommentsByPr = await Promise.all(
        items.map((item) => limit(() => this.fetchReviewCommentsForPr(item))),
      );

      pullRequests.push(
        ...items.map((item, i) =>
          this.createApplicationPullRequest({
            title: item.title,
            url: item.html_url,
            createdAt: item.created_at,
            mergedAt: item.pull_request?.merged_at,
            body: item.body,
            authorId: item.user?.id,
            reviewComments: reviewCommentsByPr[i],
          }),
        ),
      );
    }

    return pullRequests;
  }

  public createApplicationPullRequest(data: PullRequestData) {
    return new PullRequest(data);
  }

  private async fetchReviewCommentsForPr(item: {
    repository_url: string;
    number: number;
  }): Promise<RestReviewComment[]> {
    const [owner, repo] = this.parseOwnerRepo(item.repository_url);
    if (!owner || !repo) return [];

    const comments = await this.octokit.paginate(
      this.octokit.rest.pulls.listReviewComments,
      {
        owner,
        repo,
        pull_number: item.number,
        per_page: PAGINATOR_ITEMS_PER_PAGE,
      },
    );

    return comments as RestReviewComment[];
  }

  private parseOwnerRepo(
    repositoryUrl: string,
  ): [string, string] | [null, null] {
    const match = repositoryUrl.match(
      /^https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)$/,
    );
    if (!match) return [null, null];
    return [match[1], match[2]];
  }

  private initializeClient() {
    this.octokit = new Octokit({
      auth: this.configService.get('GITHUB_PERSONAL_ACCESS_TOKEN') as string,
    });
  }
}
