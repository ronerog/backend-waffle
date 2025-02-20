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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../database/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "seu-segredo-super-seguro";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userExists = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            res.status(400).json({ error: "E-mail já cadastrado" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.default.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar usuário", details: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            res.status(401).json({ error: "Usuário não encontrado" });
            return;
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Senha inválida" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao fazer login", details: error.message });
    }
});
exports.login = login;
