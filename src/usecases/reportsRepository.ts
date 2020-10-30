import { Report, ReportType } from '../domain';

export interface IReportsRepository {
  create(params: { lgtmId: string; type: ReportType; text: string; }): Promise<Report>;
}
