export type AvailableModel = {
  id: string;
  created: number;
  object: string;
  owned_by: string;
};

export type UsageCardData = {
  title: string;
  description: string;
  iconUrl: string;
};

export type Quarter = {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
};

export type SummaryState = {
  username: string;
  organization: string | null;
  startDate: string;
  endDate: string;
  model: string;
  useCustomDates: boolean;
  selectedQuarter: Quarter;
};

export type PersistedFormState = {
  username: string;
  organization: string;
  selectedQuarterIndex: number;
  useCustomDates: boolean;
  startDate: string;
  endDate: string;
  aiModel: string;
};

export type PullRequestApiData = {
  title: string;
  url: string;
  mergedAt: Date | null;
  createdAt: Date;
  body: string | null;
};

export type ApiValidationStatus = "idle" | "checking" | "valid" | "invalid";

export type ApiValidationResult = {
  status: ApiValidationStatus;
  message?: string;
};
