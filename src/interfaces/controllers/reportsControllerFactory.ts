import { ReportsController, IReportsController } from '.';

export class ReportsControllerFactory {
  public create(): IReportsController {
    return new ReportsController();
  }
}
