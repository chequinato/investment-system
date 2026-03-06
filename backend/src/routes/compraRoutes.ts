
import { Router } from "express";
import { criarCompraController, listarComprasController } from "../controllers/compraController";

const router = Router();

// POST /compras
router.post("/", criarCompraController);

// GET /compras
router.get("/", listarComprasController);

export default router;