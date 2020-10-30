import * as uuid from 'uuid';
import { Report, ReportType } from '../../domain';
import { DynamoDBDocumentClientFactory } from '.';

export interface IReportsRepository {
  create(params: { lgtmId: string; type: ReportType; text: string; }): Promise<Report>;
}

export class ReportsRepository implements IReportsRepository {
  private dynamodbDocumentClient = new DynamoDBDocumentClientFactory().create();
  private tableName: string;

  constructor(config: { tableName: string; }) {
    this.tableName = config.tableName;
  }

  public async create(params: { lgtmId: string; type: ReportType; text: string; }): Promise<Report> {
    const report: Report = {
      id: uuid.v4(),
      lgtm_id: params.lgtmId,
      type: params.type,
      text: params.text,
      created_at: new Date().toISOString(),
    };

    await this.dynamodbDocumentClient.put({
      TableName: this.tableName,
      Item: report,
    }).promise();

    return report;
  }
}
