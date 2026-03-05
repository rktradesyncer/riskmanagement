import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { SystemController } from './controller';

export class SystemRoutes {
  public async register(server: Hapi.Server): Promise<void> {
    return new Promise<void>((resolve) => {

      const controller = new SystemController();
      server.bind(controller);

      server.route([
        {
          method: "GET",
          path: "/risk-management/health",
          options: {
            auth: false,
            tags: ["api", "System"],
            description: "Health check",
            notes: "Returns service status. No authentication required.",
            handler: controller.system,
            response: {
              status: {
                200: Joi.object({
                  status: Joi.string().example("ok"),
                  service: Joi.string().example("tradovate-risk-management"),
                  timestamp: Joi.string().isoDate(),
                }).label("HealthResponse"),
              },
            },
          },
        },
      ]);

      resolve();
    });
  }
}