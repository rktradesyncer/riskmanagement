export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Tradovate Risk Management API",
    description:
      "Microservice for setting daily loss limits (DLL) and daily profit targets (DPT) on Tradovate accounts via the Tradovate API.",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:4000", description: "Local development" },
  ],
  security: [{ firebaseAuth: [] }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["System"],
        security: [],
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    service: {
                      type: "string",
                      example: "tradovate-risk-management",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/accounts": {
      get: {
        summary: "List Tradovate accounts",
        description:
          "Returns all accounts accessible by the authenticated user's Tradovate connection.",
        tags: ["Accounts"],
        parameters: [
          {
            name: "connectionRef",
            in: "query",
            required: true,
            description: "Tradovate connection reference (e.g. TS-447E7D)",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "List of accounts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    accounts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Account" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/ConnectionNotFound" },
        },
      },
    },
    "/risk/{accountId}": {
      get: {
        summary: "Get current risk settings",
        description:
          "Returns the current auto-liquidation settings for a specific account.",
        tags: ["Risk"],
        parameters: [
          {
            name: "accountId",
            in: "path",
            required: true,
            description: "Tradovate account ID (integer)",
            schema: { type: "integer" },
          },
          {
            name: "connectionRef",
            in: "query",
            required: true,
            description: "Tradovate connection reference",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Current auto-liq settings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    autoLiq: { $ref: "#/components/schemas/AutoLiqSettings" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/ConnectionNotFound" },
        },
      },
      post: {
        summary: "Set risk limits",
        description:
          "Set daily loss limit (DLL), daily profit target (DPT), and other auto-liquidation parameters for a specific account.",
        tags: ["Risk"],
        parameters: [
          {
            name: "accountId",
            in: "path",
            required: true,
            description: "Tradovate account ID (integer)",
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["connectionRef"],
                properties: {
                  connectionRef: {
                    type: "string",
                    description: "Tradovate connection reference",
                    example: "TS-447E7D",
                  },
                  dailyLossAutoLiq: {
                    type: "number",
                    description: "$ Daily Loss Limit (triggers auto-liquidation)",
                    example: 500,
                  },
                  dailyProfitAutoLiq: {
                    type: "number",
                    description: "$ Daily Profit Target (triggers auto-liquidation)",
                    example: 1000,
                  },
                  weeklyLossAutoLiq: {
                    type: "number",
                    description: "$ Weekly Loss Limit",
                  },
                  weeklyProfitAutoLiq: {
                    type: "number",
                    description: "$ Weekly Profit Target",
                  },
                  dailyLossAlert: {
                    type: "number",
                    description: "$ Daily Loss Alert threshold",
                  },
                  dailyLossLiqOnly: {
                    type: "number",
                    description: "$ Daily Loss for Liquidate-Only mode",
                  },
                  marginPercentageAutoLiq: {
                    type: "number",
                    description: "Margin % for auto-liquidation",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Risk limits updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    autoLiq: { $ref: "#/components/schemas/AutoLiqSettings" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/ConnectionNotFound" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      firebaseAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Firebase ID Token",
        description: "Firebase ID token from the Tradesyncer frontend",
      },
    },
    schemas: {
      Account: {
        type: "object",
        properties: {
          id: { type: "integer", example: 37857980 },
          name: { type: "string", example: "MFFUEVPRO203682060" },
          userId: { type: "integer" },
          accountType: { type: "string", example: "Customer" },
          active: { type: "boolean", example: true },
        },
      },
      AutoLiqSettings: {
        type: "object",
        properties: {
          id: { type: "integer" },
          dailyLossAutoLiq: {
            type: "number",
            nullable: true,
            description: "$ Daily Loss Limit",
            example: 500,
          },
          dailyProfitAutoLiq: {
            type: "number",
            nullable: true,
            description: "$ Daily Profit Target",
            example: 1000,
          },
          weeklyLossAutoLiq: {
            type: "number",
            nullable: true,
            description: "$ Weekly Loss Limit",
          },
          weeklyProfitAutoLiq: {
            type: "number",
            nullable: true,
            description: "$ Weekly Profit Target",
          },
          marginPercentageAutoLiq: { type: "number", nullable: true },
          dailyLossAlert: { type: "number", nullable: true },
          dailyLossLiqOnly: { type: "number", nullable: true },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "No valid risk parameters provided" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication failed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Invalid or expired auth token",
                },
              },
            },
          },
        },
      },
      ConnectionNotFound: {
        description: "Tradovate connection not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "No Tradovate token found for user xxx, connection TS-XXX",
                },
              },
            },
          },
        },
      },
    },
  },
};
