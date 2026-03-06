

import { Request, Response } from "express";
import { criarPagamento, processarPagamento } from "../services/pagamentoService";
import { listarPagamentos } from "../services/pagamentoService"
import { AuthRequest } from "../middleware/auth";


export async function criarPagamentoController(req: AuthRequest, res: Response) {
  try {
    const { compraId, valor } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const pagamento = await criarPagamento(compraId, valor, userId);
    res.json(pagamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}

export async function processarPagamentoController(req: Request, res: Response) {

    try {

        const { id } = req.params;
        const { sucesso } = req.body;

        const pagamento = await processarPagamento(Number(id), sucesso);

        res.json(pagamento);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Erro ao processar pagamento" });
    }

}

export async function listarPagamentosController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const pagamentos = await listarPagamentos(userId);
    return res.json(pagamentos)
  } catch (error) {

    return res.status(500).json({
      error: "Erro ao listar pagamentos"
    })

  }
}