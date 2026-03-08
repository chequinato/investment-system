
import { Router } from "express";
import { listarHistorico } from "../controllers/historicoController";

const router = Router();

router.get("/historico", listarHistorico);

export default router;