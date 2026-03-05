import Hapi from '@hapi/hapi';
import { DocsController } from './controller';

export class DocsRoutes {
  public async register(server: Hapi.Server): Promise<void> {
    return new Promise<void>((resolve) => {

      const controller = new DocsController();
      server.bind(controller);

      server.route([
        {
          method: 'GET',
          path: '/risk-management/docs',
          options: {
            auth: false,
            plugins: { "hapi-swagger": { exclude: true } },
            handler: controller.docs
          },
        },
      ]);

      resolve();
    });
  }
}