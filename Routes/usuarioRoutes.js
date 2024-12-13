import express from "express";
import {
  formularioLogin,
  formularioPasswordRecovery,
  registrar,
  confirmar,
  formularioRegistro,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/recovery", formularioPasswordRecovery);

export default router;
