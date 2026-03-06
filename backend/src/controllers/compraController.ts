
import { Request, Response } from "express";
import { criarCompra } from "../services/compraService";
import { listarCompras } from "../services/compraService";
import { AuthRequest } from "../middleware/auth";

export async function criarCompraController(req: AuthRequest, res: Response) {
  try {
    const { ticker, quantidade, precoUnitario } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const compra = await criarCompra({
      ticker,
      quantidade,
      precoUnitario,
      userId
    });
    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar compra" });
  }
}

export async function listarComprasController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const compras = await listarCompras(userId);
    res.json(compras);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro ao listar compras" });
  }
}