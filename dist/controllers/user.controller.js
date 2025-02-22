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
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../database/db"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield db_1.default.query("SELECT id, email, created_at, adm FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.json(user.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário", details: error.message });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const { adm } = req.body;
        const result = yield db_1.default.query("UPDATE users SET adm = $1 WHERE email = $2 RETURNING id, email, created_at, adm", [adm, email]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.json({ message: "Usuário atualizado com sucesso", user: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário", details: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const result = yield db_1.default.query("DELETE FROM users WHERE email = $1 RETURNING id", [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.json({ message: "Usuário deletado com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário", details: error.message });
    }
});
exports.deleteUser = deleteUser;
