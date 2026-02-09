import dotenv from "dotenv";
import path from "path";
import Hapi from "@hapi/hapi";
import { initFirebase } from "./firebase";
import { authPlugin } from "./middleware";
import { registerRoutes } from "./routes";

// Load environment-specific .env file
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.prod" : ".env.dev";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`Loaded env: ${envFile} (NODE_ENV=${nodeEnv})`);

const init = async () => {
  // Initialize Firebase (auth only)
  initFirebase();

  const server = Hapi.server({
    port: parseInt(process.env.PORT ?? "4000", 10),
    host: "0.0.0.0",
    routes: {
      cors: true,
    },
  });

  // Register auth plugin (Firebase + Supabase token lookup)
  await server.register(authPlugin);

  // Register routes
  registerRoutes(server);

  await server.start();

  console.log(`Risk Management Microservice running on ${server.info.uri}`);
  console.log(`Health: ${server.info.uri}/health`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /accounts                  - List accounts`);
  console.log(`  GET  /risk/{accountId}           - Get risk settings`);
  console.log(`  POST /risk/{accountId}           - Set risk settings`);
  console.log(`\nHeaders required:`);
  console.log(`  Authorization: Bearer <firebase_id_token>`);
  console.log(`  + connectionRef in payload, query, or X-Connection-Ref header`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
