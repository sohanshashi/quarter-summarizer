export type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

// picking fields that are only needed within the scope of the project
export type RestReviewComment = {
  id: number;
  body: string;
  user: { login: string; type: string; id: number };
  created_at: string;
  in_reply_to_id?: number;
};

// for the constructor
export type PullRequestData = {
  title: string;
  url: string;
  createdAt: string;
  reviewComments: RestReviewComment[];
  authorId?: number;
  mergedAt?: string | null | undefined;
  description?: string | undefined;
};
