import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { AccountsController } from './controller';
import { AccountSchema, ErrorSchema } from './interface';

export class AccountsRoutes {
  public async register(server: Hapi.Server): Promise<void> {
    return new Promise<void>((resolve) => {

      const controller = new AccountsController();
      server.bind(controller);

      server.route([
        {
          method: "GET",
          path: "/risk-management/accounts",
          options: {
            auth: "firebase",
            tags: ["api", "Accounts"],
            description: "List Tradovate accounts",
            notes:
              "Returns all accounts accessible by the authenticated user's Tradovate connection.",
            validate: {
              query: Joi.object({
                connectionRef: Joi.string()
                  .required()
                  .description("Tradovate connection reference (e.g. TS-447E7D)"),
              }),
              headers: Joi.object({
                authorization: Joi.string()
                  .required()
                  .description("Bearer <firebase_id_token>"),
              }).unknown(true),
            },
            handler: controller.get,
            response: {
              status: {
                200: Joi.object({
                  success: Joi.boolean().example(true),
                  accounts: Joi.array().items(AccountSchema),
                }).label("AccountsResponse"),
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
                500: ErrorSchema,
              },
            },
          },
        },
      ]);

      resolve();
    });
  }
}