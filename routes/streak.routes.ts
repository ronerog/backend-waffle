import { Router } from "express";
import { getAllStreaks, getStreakByEmail }  from "../controllers/streak.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.get("/streaks", authenticateToken, getAllStreaks);
router.get("/streaks/:email", getStreakByEmail);

export default router;