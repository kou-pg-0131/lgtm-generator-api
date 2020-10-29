import * as uuid from 'uuid';
import { Report, ReportType } from '../../domain';
import { IReportsRepository } from '../../usecases';
import { DynamoDBDocumentClientFactory } from '.';

export class ReportsRepository implements IReportsRepository {
  private dynamodbDocumentClient = new DynamoDBDocumentClientFactory().create();
  private tableName: string;

  constructor(config: { tableName: string; }) {
    this.tableName = config.tableName;
  }

  public async create(params: { type: ReportType; text: string; }): Promise<Report> {
    const report: Report = {
      ...params,
      id: uuid.v4(),
      created_at: new Date().toISOString(),
    };

    await this.dynamodbDocumentClient.put({
      TableName: this.tableName,
      Item: report,
    }).promise();

    return report;
  }
}
