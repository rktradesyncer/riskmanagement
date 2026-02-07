import { Router, Request, Response } from "express";
import { TradovateAuth } from "../../lib/auth";
import { getAutoLiqSettings, setAutoLiqSettings } from "../../lib/risk";

const router = Router();

/**
 * GET /risk/:accountId
 * Get current auto-liq settings for an account.
 */
router.get("/:accountId", async (req: Request, res: Response) => {
  try {
    const auth: TradovateAuth = (req as any).tradovateAuth;
    const accountId = parseInt(req.params.accountId as string, 10);

    if (isNaN(accountId)) {
      res.status(400).json({ success: false, error: "Invalid account ID" });
      return;
    }

    const settings = await getAutoLiqSettings(auth, accountId);
    res.json({ success: true, autoLiq: settings[0] ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`GET /risk/${req.params.accountId} error:`, message);
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * POST /risk/:accountId
 * Set auto-liq parameters for an account.
 *
 * Body (all fields optional):
 *   - dailyLossAutoLiq: number     ($ daily loss limit)
 *   - dailyProfitAutoLiq: number   ($ daily profit target)
 *   - weeklyLossAutoLiq: number    ($ weekly loss limit)
 *   - dailyLossAlert: number       ($ daily loss alert)
 *   - dailyLossLiqOnly: number     ($ daily loss liq-only)
 *   - marginPercentageAutoLiq: number
 */
router.post("/:accountId", async (req: Request, res: Response) => {
  try {
    const auth: TradovateAuth = (req as any).tradovateAuth;
    const accountId = parseInt(req.params.accountId as string, 10);

    if (isNaN(accountId)) {
      res.status(400).json({ success: false, error: "Invalid account ID" });
      return;
    }

    // Only forward fields that are valid for PermissionedAccountAutoLiq
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
      if (req.body[field] != null) {
        settings[field] = req.body[field];
      }
    }

    if (Object.keys(settings).length === 0) {
      res.status(400).json({
        success: false,
        error: "No valid risk parameters provided",
      });
      return;
    }

    const result = await setAutoLiqSettings(auth, accountId, settings);
    res.json({ success: true, autoLiq: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`POST /risk/${req.params.accountId} error:`, message);
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
