import { PullRequestData } from 'src/types';

export class PullRequest {
  readonly #title: string;
  readonly #url: string;
  readonly #mergedAt: string | null | undefined;
  readonly #createdAt: string;
  readonly #body: string | null | undefined;

  constructor(data: PullRequestData) {
    this.#title = data.title;
    this.#url = data.url;
    this.#mergedAt = data.mergedAt;
    this.#createdAt = data.createdAt;
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

  get createdAt() {
    return new Date(this.#createdAt);
  }

  get body() {
    if (!this.#body) return null;

    return this.#body;
  }

  toJSON() {
    return {
      title: this.title,
      url: this.url,
      mergedAt: this.mergedAt,
      createdAt: this.createdAt,
      body: this.body,
    };
  }
}
