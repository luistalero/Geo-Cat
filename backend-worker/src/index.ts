import { Hono } from "hono";

type Bindings = {
	USER: string;
	PASSWORD: string;
	MIMUJER: string;
	MIMUJERPASS: string;
	N8N_WEBHOOK_URL: string;
	data: string;
  };

const app = new Hono<{ Bindings: Bindings }>();

// Ruta de prueba
app.get("/", (c) => c.text("Servidor backend funcionando 🚀"));

// Ruta de login con variables de entorno
app.post("/api/auth/login", async (c) => {
	const { username, password } = await c.req.json();

	const USERS: Record<string, string> = {
	  [c.env.USER]: c.env.PASSWORD,
	  [c.env.MIMUJER]: c.env.MIMUJERPASS,
	};

	if (!username || !password) {
	  return c.json({ error: "Faltan credenciales" }, 400);
	}

	if (USERS[username] !== password) {
	  return c.json({ error: "Credenciales inválidas" }, 401);
	}

	return c.json({ success: true, username });
  });

// Ruta para enviar mensajes a n8n
app.post("/api/chat/send", async (c) => {
	const { message, username } = await c.req.json<{ message: string; username: string }>();

	if (!message) return c.json({ error: "El mensaje es requerido" }, 400);

	const response = await fetch(c.env.N8N_WEBHOOK_URL, {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ message, username }),
	});

	const data = (await response.json()) as { reply?: string };

	return c.json({
	  success: true,
	  reply: data.reply ?? "Sin respuesta de n8n",
	});
  });


export default app;
