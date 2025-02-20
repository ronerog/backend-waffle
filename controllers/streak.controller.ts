import { Request, Response } from "express";
import pool from "../database/db"; 

export const getAllStreaks = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(`
            SELECT email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak, created_at 
            FROM posts
            ORDER BY created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar os streaks:", (error as Error).stack);
        res.status(500).json({ error: "Erro interno do servidor", details: (error as Error).message });
    }
};

export default getAllStreaks;
