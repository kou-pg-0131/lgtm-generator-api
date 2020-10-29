import { ReportsController, IReportsController } from '.';
import { IReportsUsecase, ReportsUsecase, IReportsRepository } from '../../usecases';
import { ReportsRepository } from '../gateways';

export class ReportsControllerFactory {
  public create(): IReportsController {
    return new ReportsController({
      reportsUsecase: this.createReportsUsecase(),
    });
  }

  private createReportsUsecase(): IReportsUsecase {
    return new ReportsUsecase({
      reportsRepository: this.createReportsRepository(),
    });
  }

  private createReportsRepository(): IReportsRepository {
    return new ReportsRepository({
      tableName: process.env.DYNAMODB_TABLE_REPORTS,
    });
  }
}
