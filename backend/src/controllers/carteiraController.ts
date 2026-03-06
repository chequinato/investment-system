
import { Request, Response } from "express";
import carteiraService from "../services/carteiraService";
import { AuthRequest } from "../middleware/auth";


export async function resumoCarteiraController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const resumo = await carteiraService.resumoCarteira(userId);
    res.json(resumo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular carteira" });
  }
}