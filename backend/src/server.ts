
import express from "express";
import cors from "cors";


import compraRoutes from "./routes/compraRoutes";
import pagamentoRoutes from "./routes/pagamentoRoutes";
import carteiraRoutes from "./routes/carteiraRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/auth";
import historicoRoutes from "./routes/historicoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// Proteger rotas abaixo
app.use("/compras", authenticateToken, compraRoutes);
app.use("/pagamentos", authenticateToken, pagamentoRoutes);
app.use("/carteira", authenticateToken, carteiraRoutes);

app.use("/historico", authenticateToken, historicoRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});