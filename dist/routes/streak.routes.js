"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const streak_controller_1 = require("../controllers/streak.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/streaks", auth_middleware_1.authenticateToken, streak_controller_1.getAllStreaks);
router.get("/streaks/:email", streak_controller_1.getStreakByEmail);
exports.default = router;
