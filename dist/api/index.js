"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const webhook_routes_1 = __importDefault(require("../routes/webhook.routes"));
const streak_routes_1 = __importDefault(require("../routes/streak.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("", webhook_routes_1.default);
app.use("/", streak_routes_1.default);
app.options("/webhook", (req, res) => {
    res.set("Allow", "POST, OPTIONS");
    res.sendStatus(200);
});
// Definir a porta com tipagem correta
const PORT = Number(process.env.PORT) || 3005;
app.listen(PORT, () => {
    console.log(`Webhook rodando na porta ${PORT}`);
});
exports.default = app;
