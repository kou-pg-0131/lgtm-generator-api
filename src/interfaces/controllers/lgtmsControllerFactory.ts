import { ILgtmsController, LgtmsController } from '.';
import { ILgtmsRepository, ILgtmsUsecase, LgtmsUsecase } from '../../usecases';
import { LgtmsRepository } from '../gateways';
import { ImageLoader, LgtmWriter, S3FileStorage, Renderer } from '../../infrastructures';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController({
      lgtmsUsecase: this.createLgtmsUsecase(),
      renderer: new Renderer(),
    });
  }

  private createLgtmsUsecase(): ILgtmsUsecase {
    return new LgtmsUsecase({
      lgtmsRepository: this.createLgtmsRepository(),
    });
  }

  private createLgtmsRepository(): ILgtmsRepository {
    return new LgtmsRepository({
      fileStorage: new S3FileStorage({ bucket: process.env.S3_BUCKET_LGTMS }),
      tableName: process.env.DYNAMODB_TABLE_LGTMS,
      imageLoader: new ImageLoader(),
      lgtmWriter: new LgtmWriter(),
    });
  }
}
