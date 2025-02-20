"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const db_1 = __importDefault(require("../database/db"));
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data || !data.email || !data.id) {
            res.status(400).json({ error: "Parâmetros inválidos" });
            return;
        }
        const { email, id, utm_source, utm_medium, utm_campaign, utm_channel, created_at } = data;
        console.log("Webhook recebido:", { email, id, utm_source, utm_medium, utm_campaign, utm_channel, created_at });
        const result = yield db_1.default.query(`SELECT email, streak, created_at 
             FROM posts 
             WHERE email = $1 
             ORDER BY created_at DESC 
             LIMIT 1`, [email]);
        let newStreak = 1;
        if (result.rows.length > 0) {
            const lastPost = result.rows[0];
            const lastDate = new Date(lastPost.created_at);
            const today = new Date(created_at);
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                newStreak = lastPost.streak + 1;
            }
            else if (diffDays > 1) {
                newStreak = 1;
            }
        }
        yield db_1.default.query(`INSERT INTO posts (email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [email, id, utm_source, utm_medium, utm_campaign, utm_channel, newStreak, created_at]);
        console.log(`Streak atualizado: ${newStreak} para ${email}`);
        res.status(200).json({ message: "Webhook processado com sucesso", streak: newStreak });
    }
    catch (error) {
        console.error("Erro ao processar webhook:", error.stack);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});
exports.handleWebhook = handleWebhook;
