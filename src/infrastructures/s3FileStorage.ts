import { S3 } from 'aws-sdk';
import { IFileStorage } from '../interfaces/gateways';

export class S3FileStorage implements IFileStorage {
  private bucket: string;
  private s3Client = new S3();

  constructor(
    config: {
      bucket: string;
    },
  ) {
    this.bucket = config.bucket;
  }

  public async save(params: { path: string; data: Buffer; contentType: string; }): Promise<void> {
    await this.s3Client.putObject({
      Bucket: this.bucket,
      Key: params.path,
      Body: params.data,
      ContentType: params.contentType,
    }).promise();
  }
}
