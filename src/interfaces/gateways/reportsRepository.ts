import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { Report, ReportType } from '../../domain';

export interface IReportsRepository {
  create(params: { lgtmId: string; type: ReportType; text: string; }): Promise<Report>;
}

export class ReportsRepository implements IReportsRepository {
  constructor(private config: { tableName: string; dynamodbDocumentClient: DynamoDB.DocumentClient }) {}

  public async create(params: { lgtmId: string; type: ReportType; text: string; }): Promise<Report> {
    const report: Report = {
      id: uuid.v4(),
      lgtm_id: params.lgtmId,
      type: params.type,
      text: params.text,
      created_at: new Date().toISOString(),
    };

    await this.config.dynamodbDocumentClient.put({
      TableName: this.config.tableName,
      Item: report,
    }).promise();

    return report;
  }
}
