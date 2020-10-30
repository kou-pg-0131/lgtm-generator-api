import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import 'source-map-support/register';
import { IImagesRepository } from '../gateways';
import { ImagesControllerFactory, IRenderer, IResponse } from '.';

export interface IImagesController {
  search(event: APIGatewayProxyEventV2): Promise<IResponse>;
}

export class ImagesController implements IImagesController {
  private renderer: IRenderer;
  private imagesRepository: IImagesRepository;

  constructor(config: { imagesRepository: IImagesRepository; renderer: IRenderer; }) {
    this.imagesRepository = config.imagesRepository;
    this.renderer = config.renderer;
  }

  public async search(event: APIGatewayProxyEventV2): Promise<IResponse> {
    const q = event.queryStringParameters?.q;
    if (!q) return this.renderer.badRequest();

    const images = await this.imagesRepository.search({ q });
    return this.renderer.ok({ body: JSON.stringify(images), contentType: 'application/json' });
  }
}

export const searchImages: APIGatewayProxyHandlerV2 = async (event, _context, _callback) => {
  return new ImagesControllerFactory().create().search(event) as APIGatewayProxyResultV2;
};
