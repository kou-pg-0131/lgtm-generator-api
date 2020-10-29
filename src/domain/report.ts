export const ReportType = {
  illegal: 'illegal',
  inappropriate: 'inappropriate',
  other: 'other',
} as const;

export type ReportType = typeof ReportType[keyof typeof ReportType];

export type Report = {
  id: string;
  created_at: string;
  type: ReportType;
  text: string;
};
