import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Report, ReportType } from '../../domain';
import { IReportsRepository } from '../../usecases';

export class ReportsRepository implements IReportsRepository {
  private dynamodbClient = new DynamoDB.DocumentClient({
    region:   (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'localhost' : undefined,
    endpoint: (process.env.IS_LOCAL === 'true' || process.env.IS_OFFLINE === 'true') ? 'http://dynamodb:8000' : undefined,
  });
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

    await this.dynamodbClient.put({
      TableName: this.tableName,
      Item: report,
    }).promise();

    return report;
  }
}
