import { PullRequestData, RestReviewComment } from 'src/types';

export class PullRequest {
  readonly #title: string;
  readonly #url: string;
  readonly #mergedAt: string | null | undefined;
  readonly #createdAt: string;
  readonly #body: string | null | undefined;
  readonly #reviewComments: RestReviewComment[];
  readonly #authorId: number | null | undefined;

  constructor(data: PullRequestData) {
    this.#title = data.title;
    this.#url = data.url;
    this.#mergedAt = data.mergedAt;
    this.#createdAt = data.createdAt;
    this.#body = data.body;
    this.#reviewComments = data.reviewComments;
    this.#authorId = data.authorId;
  }

  get reviewComments() {
    return this.#reviewComments
      .map(({ id, body, user, created_at, in_reply_to_id }) => ({
        id,
        body,
        user: {
          login: user.login,
          type: user.type,
          id: user.id,
        },
        created_at,
        in_reply_to_id,
      }))
      .filter((comment) => comment.user.type !== 'Bot');
  }

  get authorId() {
    return this.#authorId;
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

  public reviewThreads() {
    const groupedComments = this.groupReviewComments();
    return Array.from(groupedComments.values()).map((comments) => ({
      messages: comments.map((comment) => ({
        role: comment.user.id === this.authorId ? 'Author' : 'Reviewer',
        author: comment.user.login,
        body: comment.body,
      })),
    }));
  }

  public toJSON() {
    return {
      title: this.title,
      url: this.url,
      mergedAt: this.mergedAt,
      createdAt: this.createdAt,
      body: this.body,
      authorId: this.authorId,
      reviewThreads: this.reviewThreads(),
    };
  }

  private groupReviewComments() {
    const groupedReviewComments = new Map<number, RestReviewComment[]>();

    for (const comment of this.reviewComments) {
      const rootId = comment.in_reply_to_id || comment.id;

      if (!groupedReviewComments.has(rootId)) {
        groupedReviewComments.set(rootId, []);
      }

      groupedReviewComments.set(rootId, [
        ...(groupedReviewComments.get(rootId) ?? []),
        comment,
      ]);
    }

    return groupedReviewComments;
  }
}
