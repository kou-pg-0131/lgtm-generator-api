import { ReportsController, IReportsController } from '.';
import { IReportsUsecase, ReportsUsecase, IReportsRepository } from '../../usecases';
import { ReportsRepository } from '../gateways';
import { Renderer } from '../../infrastructures';

export class ReportsControllerFactory {
  public create(): IReportsController {
    return new ReportsController({
      reportsUsecase: this.createReportsUsecase(),
      renderer: new Renderer(),
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
