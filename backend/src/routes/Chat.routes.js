import { Router } from "express";
import "dotenv/config";

const router = Router();

router.post("/send", async (req, res) => {
  try {
    const { message, role, username } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido" });
    }

    const n8nUrl =
      process.env.N8N_WEBHOOK_URL ||
      "https://n8n-crm-production.up.railway.app/webhook-test/geo-cat-chat";

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, role, username }), // 🔥 aquí mandamos también username
    });

    const data = await response.json();

    res.json({
      success: true,
      from: "n8n",
      reply: data.reply || data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error comunicándose con n8n" });
  }
});

router.post("/receive", (req, res) => {
  const { reply } = req.body;
  console.log("Mensaje recibido de n8n:", reply);
  res.json({ success: true, msg: "Recibido en backend", reply });
});

export default router;
