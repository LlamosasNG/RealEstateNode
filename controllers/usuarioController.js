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
    .withMessage("In name cannot be empty")
    .run(req);
  await check("email").isEmail().withMessage("This is not an email").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters long")
    .run(req);
    // Comparar repeat_password con el valor de password
  await check("repeat_password")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords must match");
    }
    return true;
  })
  .run(req);
  
  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: result.array(),
    });
  }

  res.json(result.array());

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
