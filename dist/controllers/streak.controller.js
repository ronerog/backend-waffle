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
exports.getStreakByEmail = exports.getAllStreaks = void 0;
const db_1 = __importDefault(require("../database/db"));
const getAllStreaks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query(`
            SELECT email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak, created_at 
            FROM posts
            ORDER BY created_at DESC
        `);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar os streaks:", error.stack);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});
exports.getAllStreaks = getAllStreaks;
const getStreakByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email) {
            res.status(400).json({ error: "Email é obrigatório" });
            return;
        }
        const result = yield db_1.default.query("SELECT * FROM posts WHERE email = $1 ORDER BY created_at DESC", [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Nenhum streak encontrado" });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar streaks:", error);
        res.status(500).json({ error: "Erro ao buscar streaks" });
    }
});
exports.getStreakByEmail = getStreakByEmail;
exports.default = exports.getAllStreaks;
