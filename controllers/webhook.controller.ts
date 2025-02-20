import { Request, Response } from "express";
import pool from "../database/db";

interface PostRow {
    email: string;
    streak: number;
    created_at: string;
}

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data } = req.body;
        
        if (!data || !data.email || !data.id) {
            res.status(400).json({ error: "Parâmetros inválidos" });
            return;
        }

        const { email, id, utm_source, utm_medium, utm_campaign, utm_channel, created_at } = data;

        console.log("Webhook recebido:", { email, id, utm_source, utm_medium, utm_campaign, utm_channel, created_at });

        const result = await pool.query<PostRow>(
            `SELECT email, streak, created_at 
             FROM posts 
             WHERE email = $1 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [email]
        );

        let newStreak = 1;

        if (result.rows.length > 0) {
            const lastPost = result.rows[0];
            const lastDate = new Date(lastPost.created_at);
            const today = new Date(created_at);
            
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = lastPost.streak + 1;
            } else if (diffDays > 1) {
                newStreak = 1; 
            }
        }

        await pool.query(
            `INSERT INTO posts (email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [email, id, utm_source, utm_medium, utm_campaign, utm_channel, newStreak, created_at]
        );

        console.log(`Streak atualizado: ${newStreak} para ${email}`);
        res.status(200).json({ message: "Webhook processado com sucesso", streak: newStreak });

    } catch (error) {
        console.error("Erro ao processar webhook:", (error as Error).stack);
        res.status(500).json({ error: "Erro interno do servidor", details: (error as Error).message });
    }
};
