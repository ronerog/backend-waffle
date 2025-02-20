import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "seu-segredo-super-seguro";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        res.status(403).json({ error: "Token não fornecido" });
        return
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }

        req.body.user = decoded;
        next();
    });
};