import { Router, Request, Response } from "express";
import { TradovateAuth } from "../../lib/auth";
import { listAccounts } from "../../lib/accounts";

const router = Router();

/**
 * GET /accounts
 * List all accounts for the authenticated Tradovate user.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const auth: TradovateAuth = (req as any).tradovateAuth;
    const accounts = await listAccounts(auth);
    res.json({ success: true, accounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /accounts error:", message);
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
