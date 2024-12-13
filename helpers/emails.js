import nodemailer from "nodemailer";

const registerEmail = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, email, token } = data;

  // Envíar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaíces.com",
    text: "Confirma tu cuenta en BienesRaíces.com",
    html: `
        <p>Hola ${name}, comprueba tu cuenta en BienesRaíces.com</p>
        <p>
            Tu cuenta esta lista, solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
        </p>
        <p>Si no reconoces el registro ignora este mensaje</p>
    `,
  });
};

export { registerEmail };
