export type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

export type PullRequestData = {
  title: string;
  url?: string | null | undefined;
  closedAt?: string | null | undefined;
  mergedAt?: string | null | undefined;
};
