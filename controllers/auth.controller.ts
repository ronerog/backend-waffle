import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../database/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "seu-segredo-super-seguro";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            res.status(400).json({ error: "E-mail já cadastrado" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar usuário", details: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            res.status(401).json({ error: "Usuário não encontrado" });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Senha inválida" });
            return;
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer login", details: (error as Error).message });
    }
};
