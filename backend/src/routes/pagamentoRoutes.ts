
import { Router } from "express";
import { criarPagamentoController, processarPagamentoController, listarPagamentosController } from "../controllers/pagamentoController";

const router = Router();

// POST /pagamentos
router.post("/", criarPagamentoController);

// GET /pagamentos
router.get("/", listarPagamentosController);

// PATCH /pagamentos/:id/processar
router.patch("/:id/processar", processarPagamentoController);

export default router;