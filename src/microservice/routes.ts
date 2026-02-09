import Hapi from "@hapi/hapi";
import { TradovateAuth } from "../lib/auth";
import { listAccounts } from "../lib/accounts";
import { getAutoLiqSettings, setAutoLiqSettings } from "../lib/risk";
import { openApiSpec } from "./openapi";

// Helper to extract TradovateAuth from credentials
function getAuth(request: Hapi.Request): TradovateAuth {
  return (request.auth.credentials as any).tradovateAuth;
}

export function registerRoutes(server: Hapi.Server): void {
  // ------------------------------------------------------------------
  // Health check (no auth)
  // ------------------------------------------------------------------
  server.route({
    method: "GET",
    path: "/health",
    options: { auth: false },
    handler: () => ({
      status: "ok",
      service: "tradovate-risk-management",
      timestamp: new Date().toISOString(),
    }),
  });

  // ------------------------------------------------------------------
  // OpenAPI spec (no auth)
  // ------------------------------------------------------------------
  server.route({
    method: "GET",
    path: "/openapi.json",
    options: { auth: false },
    handler: () => openApiSpec,
  });

  // ------------------------------------------------------------------
  // Scalar API docs (no auth)
  // ------------------------------------------------------------------
  server.route({
    method: "GET",
    path: "/docs",
    options: { auth: false },
    handler: (_request, h) => {
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Risk Management API Docs</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script id="api-reference" data-url="/openapi.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;
      return h.response(html).type("text/html");
    },
  });

  // ------------------------------------------------------------------
  // List accounts
  // ------------------------------------------------------------------
  server.route({
    method: "GET",
    path: "/accounts",
    options: { auth: "firebase" },
    handler: async (request, h) => {
      try {
        const auth = getAuth(request);
        const accounts = await listAccounts(auth);
        return { success: true, accounts };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("GET /accounts error:", message);
        return h.response({ success: false, error: message }).code(500);
      }
    },
  });

  // ------------------------------------------------------------------
  // Get risk settings for an account
  // ------------------------------------------------------------------
  server.route({
    method: "GET",
    path: "/risk/{accountId}",
    options: { auth: "firebase" },
    handler: async (request, h) => {
      try {
        const auth = getAuth(request);
        const accountId = parseInt(request.params.accountId, 10);

        if (isNaN(accountId)) {
          return h.response({ success: false, error: "Invalid account ID" }).code(400);
        }

        const settings = await getAutoLiqSettings(auth, accountId);
        return { success: true, autoLiq: settings[0] ?? null };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`GET /risk/${request.params.accountId} error:`, message);
        return h.response({ success: false, error: message }).code(500);
      }
    },
  });

  // ------------------------------------------------------------------
  // Set risk settings for an account
  // ------------------------------------------------------------------
  server.route({
    method: "POST",
    path: "/risk/{accountId}",
    options: { auth: "firebase" },
    handler: async (request, h) => {
      try {
        const auth = getAuth(request);
        const accountId = parseInt(request.params.accountId, 10);

        if (isNaN(accountId)) {
          return h.response({ success: false, error: "Invalid account ID" }).code(400);
        }

        const payload = request.payload as Record<string, unknown> ?? {};

        // Only forward fields valid for PermissionedAccountAutoLiq
        const allowedFields = [
          "dailyLossAutoLiq",
          "dailyProfitAutoLiq",
          "weeklyLossAutoLiq",
          "weeklyProfitAutoLiq",
          "dailyLossAlert",
          "dailyLossPercentageAlert",
          "marginPercentageAlert",
          "dailyLossLiqOnly",
          "dailyLossPercentageLiqOnly",
          "marginPercentageLiqOnly",
          "dailyLossPercentageAutoLiq",
          "marginPercentageAutoLiq",
        ];

        const settings: Record<string, unknown> = {};
        for (const field of allowedFields) {
          if (payload[field] != null) {
            settings[field] = payload[field];
          }
        }

        if (Object.keys(settings).length === 0) {
          return h
            .response({ success: false, error: "No valid risk parameters provided" })
            .code(400);
        }

        const result = await setAutoLiqSettings(auth, accountId, settings);
        return { success: true, autoLiq: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`POST /risk/${request.params.accountId} error:`, message);

        if (message.includes("401") || message.includes("Access is denied")) {
          return h
            .response({
              success: false,
              error: "Tradovate token expired. Please reconnect.",
              code: "TOKEN_EXPIRED",
            })
            .code(401);
        }

        return h.response({ success: false, error: message }).code(500);
      }
    },
  });
}
