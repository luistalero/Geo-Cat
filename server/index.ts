// server/index.ts
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Guardamos mensajes en memoria (para pruebas)
let messages: { id: number; from: string; text: string; time: string }[] = [];

// Endpoint que recibe mensajes de n8n
app.post("/messages", (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Falta el campo 'text'" });
  }

  const newMsg = {
    id: Date.now(),
    from: "bot",
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  messages.push(newMsg);

  console.log("📩 Mensaje recibido de n8n:", newMsg);

  res.json({ ok: true });
});

// Endpoint para que el frontend consulte los mensajes
app.get("/messages", (req: Request, res: Response) => {
  res.json(messages);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
