import { ILgtmsController, LgtmsController } from '.';

export class LgtmsControllerFactory {
  public create(): ILgtmsController {
    return new LgtmsController();
  }
}
