import Hapi from '@hapi/hapi';

export class SystemController {

  constructor() { }

  public async system(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    return ({
      status: "ok",
      service: "tradovate-risk-management",
      timestamp: new Date().toISOString(),
    });
  }

}
