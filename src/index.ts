import dotenv from "dotenv";
import path from "path";
import Server from './server';

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.prod" : ".env.dev";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`Loaded env: ${envFile} (NODE_ENV=${nodeEnv})`);

(async () => {
  await Server.start();
})();


process.on('unhandledRejection', async (reason) => {
  try {
    console.error(reason);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
});

process.on('uncaughtException', async (error) => {
  try {
    console.error(error);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
});
