import { ReportsController, IReportsController } from '.';
import { DynamoDBDocumentClientFactory, ReportsRepository, IReportsRepository } from '../gateways';
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
      dynamodbDocumentClient: new DynamoDBDocumentClientFactory().create(),
      tableName: process.env.DYNAMODB_TABLE_REPORTS,
    });
  }
}
