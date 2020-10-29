import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import 'source-map-support/register';
import { IImagesUsecase } from '../../usecases';
import { ImagesControllerFactory, IRenderer, IResponse } from '.';

export interface IImagesController {
  search(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

export class ImagesController implements IImagesController {
  private renderer: IRenderer;
  private imagesUsecase: IImagesUsecase;

  constructor(config: { imagesUsecase: IImagesUsecase; renderer: IRenderer; }) {
    this.imagesUsecase = config.imagesUsecase;
    this.renderer = config.renderer;
  }

  public async search(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const q = event.queryStringParameters?.q;
    if (!q) return this.renderer.badRequest();

    const images = await this.imagesUsecase.search({ q });
    return this.renderer.ok({ body: JSON.stringify(images), contentType: 'application/json' });
  }
}

export const searchImages: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ImagesControllerFactory().create().search(event) as APIGatewayProxyResultV2;
};
