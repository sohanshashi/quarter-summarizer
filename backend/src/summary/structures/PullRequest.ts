import { PullRequestData } from 'src/types';

export class PullRequest {
  readonly #title: string;
  readonly #url: string;
  readonly #mergedAt?: string | null | undefined;
  readonly #closedAt?: string | null | undefined;
  readonly #body?: string | undefined;

  constructor(data: PullRequestData) {
    this.#title = data.title;
    this.#url = data.url;
    this.#mergedAt = data.mergedAt;
    this.#closedAt = data.closedAt;
    this.#body = data.body;
  }

  get title() {
    return this.#title;
  }

  get url() {
    return this.#url;
  }

  get mergedAt() {
    if (!this.#mergedAt) return null;

    return new Date(this.#mergedAt);
  }

  get closedAt() {
    if (!this.#closedAt) return null;

    return new Date(this.#closedAt);
  }

  get body() {
    return this.#body;
  }

  toJSON() {
    return {
      title: this.title,
      url: this.url,
      mergedAt: this.mergedAt,
      closedAt: this.closedAt,
      body: this.body,
    };
  }
}
