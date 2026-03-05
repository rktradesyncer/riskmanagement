import { getRedisClient } from "./redis";
import { logger } from "./grafana";


export interface CachedRiskSettings {
  dailyLossAutoLiq?: number | null;
  dailyProfitAutoLiq?: number | null;
}

function riskKey(accountId: number): string {
  return `risk:${accountId}`;
}

/**
 * Get cached risk settings for an account.
 * Returns null if not cached or expired.
 */
export async function getCachedRisk(accountId: number): Promise<CachedRiskSettings | null> {
  try {
    const client = await getRedisClient();
    const value = await client?.get(riskKey(accountId));
    return value ? JSON.parse(value) as CachedRiskSettings : null;
  } catch (error) {
    logger.error("Error getting cached risk:", error);
    return null;
  }
}

/**
 * Cache risk settings for an account (1 hour TTL).
 */
export async function setCachedRisk(
  accountId: number,
  settings: CachedRiskSettings
): Promise<void> {
  try {
    const client = await getRedisClient();
    if (client) {
      await client.setEx(riskKey(accountId), 3600, JSON.stringify(settings));
    }
  } catch (error) {
    logger.error("Error setting cached risk:", error);
  }
}

/**
 * Invalidate cached risk settings for an account.
 */
export async function invalidateCachedRisk(accountId: number): Promise<void> {
  try {
    const client = await getRedisClient();
    if (client) {
      await client.del(riskKey(accountId));
    }
  } catch (error) {
    logger.error("Error invalidating cached risk:", error);
  }
}
