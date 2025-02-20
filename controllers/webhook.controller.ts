import { Request, Response } from "express";
import pool from "../database/db";

interface PostRow {
    email: string;
    post_id: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_channel?: string;
    streak: number;
    created_at: string;
}

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, id, utm_source, utm_medium, utm_campaign, utm_channel } = req.query as {
            email?: string;
            id?: string;
            utm_source?: string;
            utm_medium?: string;
            utm_campaign?: string;
            utm_channel?: string;
        };

        if (!email || !id) {
            res.status(400).json({ error: "Parâmetros inválidos" });
            return;
        }

        console.log("Webhook recebido:", { email, id, utm_source, utm_medium, utm_campaign, utm_channel });

        const result = await pool.query<PostRow>(
            "SELECT email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak, created_at FROM posts WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
            [email]
        );

        let newStreak = 1;

        if (result.rows.length > 0) {
            const lastPost = result.rows[0];
            const lastDate = new Date(lastPost.created_at);
            const today = new Date();
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = lastPost.streak + 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            }
        }

        await pool.query(
            "INSERT INTO posts (email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [email, id, utm_source, utm_medium, utm_campaign, utm_channel, newStreak]
        );

        console.log(`Streak atualizado: ${newStreak}`);
        res.status(200).json({ message: "Webhook processado com sucesso" });

    } catch (error) {
        console.error("Erro ao processar webhook:", (error as Error).stack);
        res.status(500).json({ error: "Erro interno do servidor", details: (error as Error).message });
    }
};
