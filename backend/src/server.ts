import "dotenv/config";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { createApp } from "./app";
import analysisRoutes from "./routes/analysisRoutes";
import infoRouter from "./routes/info";
import redisClient from "./config/redis";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) throw new Error("MONGO_URI não está definido no .env");

mongoose
  .connect(mongoUri)
  .then(() => console.log("Conectado ao Mongo"))
  .catch((err) => console.error("Erro ao conectar ao Mongo:", err));

try {
  redisClient.connect();
  console.log("Redis conectado!");
} catch (err) {
  console.error("Erro ao conectar no Redis:", err);
}

const app = createApp();
const server = createServer(app);

// Inicializa Socket.IO
const io = new IOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use("/", infoRouter);
// Passa o io para as rotas que precisam dele
app.use("/api", analysisRoutes(io));

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
