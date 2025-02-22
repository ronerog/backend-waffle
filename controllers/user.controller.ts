import { Request, Response } from "express";
import pool from "../database/db";

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const user = await pool.query("SELECT id, email, created_at, adm FROM users WHERE email = $1", [email]);
        
        if (user.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário", details: (error as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const { adm } = req.body;

        const result = await pool.query("UPDATE users SET adm = $1 WHERE email = $2 RETURNING id, email, created_at, adm", [adm, email]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        res.json({ message: "Usuário atualizado com sucesso", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário", details: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const result = await pool.query("DELETE FROM users WHERE email = $1 RETURNING id", [email]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário", details: (error as Error).message });
    }
};