import { Router } from "express";
import getAllStreaks from "../controllers/streak.controller";


const router = Router();

router.get("/streaks", getAllStreaks);

export default router;