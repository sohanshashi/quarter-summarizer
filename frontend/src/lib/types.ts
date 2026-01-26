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
