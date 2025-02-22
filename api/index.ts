import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import webhookRoutes from "../routes/webhook.routes";
import streakRoutes from "../routes/streak.routes";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("", webhookRoutes);
app.use("", streakRoutes);
app.use("", authRoutes);
app.use("", userRoutes);

app.options("/webhook", (req: Request, res: Response) => {
    res.set("Allow", "POST, OPTIONS");
    res.sendStatus(200);
});

const PORT: number = Number(process.env.PORT) || 3005;

app.listen(PORT, () => {
    console.log(`Webhook rodando na porta ${PORT}`);
});

export default app;
