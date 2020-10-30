import { ReportsController, IReportsController } from '.';
import { ReportsRepository, IReportsRepository } from '../gateways';
import { Renderer } from '../../infrastructures';

export class ReportsControllerFactory {
  public create(): IReportsController {
    return new ReportsController({
      reportsRepository: this.createReportsRepository(),
      renderer: new Renderer(),
    });
  }

  private createReportsRepository(): IReportsRepository {
    return new ReportsRepository({
      tableName: process.env.DYNAMODB_TABLE_REPORTS,
    });
  }
}
