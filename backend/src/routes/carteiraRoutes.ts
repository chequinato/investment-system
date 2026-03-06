
import { Router } from "express";
import { resumoCarteiraController } from "../controllers/carteiraController";

const router = Router();

// GET /carteira/resumo
router.get("/resumo", resumoCarteiraController);

export default router;