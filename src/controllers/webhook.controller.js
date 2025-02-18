// src/controllers/webhook.controller.js
const pool = require("../database/db");

exports.handleWebhook = async (req, res) => {
    try {
        const { email, id, utm_source, utm_medium, utm_campaign, utm_channel } = req.query;

        if (!email || !id) {
            return res.status(400).json({ error: "Parâmetros inválidos" });
        }

        console.log("Webhook recebido:", { email, id, utm_source, utm_medium, utm_campaign, utm_channel });

        const result = await pool.query(
            "SELECT * FROM posts WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
            [email]
        );

        let newStreak = 1;

        if (result.rows.length > 0) {
            const lastPost = result.rows[0];
            const lastDate = new Date(lastPost.created_at);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = lastPost.streak + 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            }
        }

        await pool.query(
            "INSERT INTO posts (email, post_id, utm_source, utm_medium, utm_campaign, utm_channel, streak) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [email, id, utm_source, utm_medium, utm_campaign, utm_channel, newStreak]
        );

        console.log(`Streak atualizado: ${newStreak}`);
        res.status(200).json({ message: "Webhook processado com sucesso" });

    } catch (error) {
        console.error("❌ Erro ao processar webhook:", error.stack); // Mostra stack do erro
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }    
};
