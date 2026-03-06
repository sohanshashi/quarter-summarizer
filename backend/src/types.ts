export type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

export type PullRequestData = {
  title: string;
  url: string;
  closedAt?: string | null | undefined;
  mergedAt?: string | null | undefined;
  body?: string | undefined;
};
