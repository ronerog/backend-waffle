import { Router } from "express";
import getAllStreaks from "../controllers/streak.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.get("/streaks", authenticateToken, getAllStreaks);

export default router;