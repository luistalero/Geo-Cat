import express from "express";
import cors from "cors";
import chatRoutes from "./routes/Chat.routes.js";
import authRoutes from "./routes/Auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 4000;
const URL = process.env.URL || 'localhost:';
app.listen(PORT, () => console.log(`🚀 Backend corriendo en ${URL}${PORT}`));
