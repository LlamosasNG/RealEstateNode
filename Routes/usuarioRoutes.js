import express from "express";
import {
  formularioLogin,
  formularioPasswordRecovery,
  formularioRegistro,
  registrar,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/recovery", formularioPasswordRecovery);

export default router;
