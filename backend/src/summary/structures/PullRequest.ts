import { ApiPullRequest } from 'src/types';

export class PullRequest {
  readonly title: string;
  readonly url: string;
  readonly #merged_at: string;
  readonly #closed_at: string;

  constructor(data: ApiPullRequest) {
    this.title = data.title;
    this.url = data.pull_request.url;
    this.#merged_at = data.pull_request.merged_at;
    this.#closed_at = data.closed_at;
  }

  get mergedAt() {
    return new Date(this.#merged_at);
  }

  get closedAt() {
    return new Date(this.#closed_at);
  }

  toJSON() {
    return {
      title: this.title,
      url: this.url,
      mergedAt: this.#merged_at,
      closedAt: this.#closed_at,
    };
  }
}
