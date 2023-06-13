require('dotenv').config();
const nodemailer = require("nodemailer");
const randomToken = require("random-token");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const jwt = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  }
});

const loginRouteHandler = async (req, res, username, password) => {
  let foundUser = await userModel.findAll({ where: { username: username } });

  if (foundUser.length === 0) {
    return res.status(400).json({
      errors: [{ detail: "As credenciais não correspondem a nenhum usuário existente" }],
    });
  } else {
    const userPassword = foundUser[0].password;
    
    if (!userPassword) {
      return res.status(400).json({
        errors: [{ detail: "A senha não está definida para o usuário" }],
      });
    }

    const validPassword = await bcrypt.compare(password, userPassword);
    
    if (validPassword) {
      const token = jwt.sign(
        { id: foundUser[0].id, username: foundUser[0].username },
        "token",
        {
          expiresIn: "24h",
        }
      );
      return res.json({
        token_type: "Bearer",
        expires_in: "24h",
        access_token: token,
        refresh_token: token,
      });

    } else {
      return res.status(400).json({
        errors: [{ detail: "Senha inválida" }],
      });
    }
  }
};



const registerRouteHandler = async (req, res, username, name, email, password) => {
  let foundUser = await userModel.findAll({ username: username });

  if (foundUser.length > 0) {
    return res.status(400).json({ message: "Usuário já está em uso" });
  }

  if (!password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 8 caracteres." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username: username,
    name: name,
    email: email,
    password: hashPassword,
  };

  try {
    await userModel.create(newUser);

    const token = jwt.sign({ username: username }, "token", {
      expiresIn: "24h",
    });

    return res.status(200).json({
      token_type: "Bearer",
      expires_in: "24h",
      access_token: token,
      refresh_token: token,
    });
  } catch (error) {    
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};




const forgotPasswordRouteHandler = async (req, res, email) => {
  let foundUser = await userModel.findAll({ email: email });

  if (!foundUser) {
    return res.status(400).json({
      errors: { email: ["O e-mail não corresponde a nenhum usuário existente."] },
    });
  } else {
    let token = randomToken(20);

    let info = await transporter.sendMail({
      from: process.env.EMAIL_ADMIN, // email saida
      to: email, // email que vai ser recuperado
      subject: "Redefinir senha", // Assunto
      html: `<p>Você solicitou a alteração de sua senha. Caso essa solicitação não tenha sido feita por você, entre em contato conosco. Acesse <a href='${process.env.APP_URL_CLIENT}/auth/reset-password?token=${token}&email=${email}'>este link</a> para redefinir sua senha</p>`, // Corpo
    });
    const dataSent = {
      data: "password-forgot",
      attributes: {
        redirect_url: `${process.env.APP_URL_API}/password-reset`,
        email: email,
      },
    };
    return res.status(204).json(dataSent);
  }
};



const resetPasswordRouteHandler = async (req, res) => {
  const foundUser = await userModel.findAll({
    email: req.body
  });

  if (!foundUser) {
    return res.status(400).json({
      errors: { email: ["Ocorreu algum erro ao encontrar email"] },
    });
  } else {
    const { password, password_confirmation } = req.body.data.attributes;
    // validar a senha
    if (password.length < 8) {
      return res.status(400).json({
        errors: {
          password: ["A senha deve ter no mínimo 8 caracteres."],
        },
      });
    }

    if (password != password_confirmation) {
      return res.status(400).json({
        errors: {
          password: ["A senha e a confirmação da senha devem corresponder."],
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await userModel.updateOne(
      { email: foundUser.email },
      { $set: { "password": hashPassword } }
    );
    return res.sendStatus(204);
  }
};

module.exports = {
  loginRouteHandler,
  registerRouteHandler,
  forgotPasswordRouteHandler,
  resetPasswordRouteHandler
}