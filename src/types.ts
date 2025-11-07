export type GetSummaryParams = {
  username: string;
  orgName: string;
  startDate: string;
  endDate: string;
};

export type ApiPullRequest = {
  title: string;
  closed_at: string;
  pull_request: {
    url: string;
    merged_at: string;
  };
  body: string;
};
