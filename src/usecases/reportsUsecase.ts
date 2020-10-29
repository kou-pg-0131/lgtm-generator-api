import { Report, ReportType } from '../domain';
import { IReportsRepository } from '.';

export interface IReportsUsecase {
  create(params: { type: ReportType; text: string; }): Promise<Report>;
}

export class ReportsUsecase implements IReportsUsecase {
  private reportsRepository: IReportsRepository;

  constructor(config: { reportsRepository: IReportsRepository }) {
    this.reportsRepository = config.reportsRepository;
  }

  public async create(params: { type: ReportType; text: string; }): Promise<Report> {
    return await this.reportsRepository.create(params);
  }
}
