import { Report, ReportType } from '../domain';

export interface IReportsRepository {
  create(params: { type: ReportType; text: string; }): Promise<Report>;
}
