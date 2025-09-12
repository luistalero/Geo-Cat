import { Router } from "express";
import "dotenv/config";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const users = [
    { username: process.env.USER, password: process.env.PASSWORD },
    { username: process.env.MIMUJER, password: process.env.MIMUJERPASS },
  ];

  console.log("Usuarios disponibles:", users); // 👈 debug

  const validUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!validUser) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  return res.json({ success: true, username });
});

export default router;
