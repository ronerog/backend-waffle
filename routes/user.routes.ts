import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/users/:email", getUser);
router.patch("/users/:email", updateUser);
router.delete("/users/:email", deleteUser);

export default router;