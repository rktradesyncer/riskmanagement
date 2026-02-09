export type Environment = "live" | "demo";

export function getBaseUrl(env: Environment): string {
  return env === "live"
    ? "https://live.tradovateapi.com/v1"
    : "https://demo.tradovateapi.com/v1";
}
