import { check, validationResult } from "express-validator";
import User from "../models/User.js";

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
  await check("email").isEmail().withMessage("Esto no parece un email").run(req);
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

  const user = await User.create(req.body);
  res.json(user);
};

const formularioPasswordRecovery = (req, res) => {
  res.render("auth/recovery-password", {
    pagina: "Recuperar Contraseña",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioPasswordRecovery,
  registrar,
};
