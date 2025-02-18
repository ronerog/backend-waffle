const express = require("express");
const cors = require("cors");
const webhookRoutes = require("./routes/webhook.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({status: 'ok'})
})

// app.all("/webhook", (req, res) => {
//     console.log("Webhook recebido:");
//     console.log("Query Params:", { email, id });
//     console.log("Body:", bodyData);
//     res.status(200).json({ message: "Webhook processado com sucesso" });
// })

app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Webhook rodando na porta ${PORT}`);
});
