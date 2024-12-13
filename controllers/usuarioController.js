import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Esto no parece un email")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe contener al menos 6 caracteres")
    .run(req);
  await check("repeat_password")
    .equals("password")
    .withMessage("La contraseña debe ser la misma")
    .run(req);

  let result = validationResult(req);

  const { name, email, password } = req.body;

  if (!result.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: result.array(),
      usuario: {
        name,
        email,
      },
    });
  }

  // Verificar usuarios duplicados
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "Este usuario ya existe" }],
      usuario: {
        name,
        email,
      },
    });
  }

  // Almacenar usuario
  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  // Envíar email de confirmación
  registerEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  // Mostrar mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un email de confirmación, da click en el enlace",
  });
};

// Función que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/account-confirmation", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  // Confirmar la cuenta
};

const formularioPasswordRecovery = (req, res) => {
  res.render("auth/recovery-password", {
    pagina: "Recuperar Contraseña",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioPasswordRecovery,
};
