export type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

export type PullRequestData = {
  title: string;
  url: string;
  createdAt: string;
  mergedAt?: string | null | undefined;
  body?: string | undefined;
};
