import type { ServerRoute } from "@hapi/hapi";
import Joi from "joi";

export const systemRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/risk-management/health",
    options: {
      auth: false,
      tags: ["api", "System"],
      description: "Health check",
      notes: "Returns service status. No authentication required.",
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
    handler: () => ({
      status: "ok",
      service: "tradovate-risk-management",
      timestamp: new Date().toISOString(),
    }),
  },
];
