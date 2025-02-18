exports.handleWebhook = (req, res) => {
    const { email, id } = req.query;
    const bodyData = req.body;

    if (!email || !id) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    console.log("Webhook recebido:");
    console.log("Query Params:", { email, id });
    console.log("Body:", bodyData);

    res.status(200).json({ message: "Webhook processado com sucesso" });
};
