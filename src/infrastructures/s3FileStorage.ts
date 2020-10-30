import { S3 } from 'aws-sdk';
import { IFileStorage } from '../interfaces/gateways';

export class S3FileStorage implements IFileStorage {
  constructor(private config: { bucket: string; s3Client: S3; }) {}

  public async save(params: { path: string; data: Buffer; contentType: string; }): Promise<void> {
    await this.config.s3Client.putObject({
      Bucket: this.config.bucket,
      Key: params.path,
      Body: params.data,
      ContentType: params.contentType,
    }).promise();
  }
}
