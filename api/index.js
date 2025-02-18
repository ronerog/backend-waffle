const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const webhookRoutes = require("../routes/webhook.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("", webhookRoutes);

app.options("/webhook", (req, res) => {
    res.set("Allow", "POST, OPTIONS");
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Webhook rodando na porta ${PORT}`);
});