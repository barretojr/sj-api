require('dotenv').config();
const nodemailer = require("nodemailer");
const randomToken = require("random-token");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const jwt = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});

async function listRouteHandler(req, res){
  try{
    const foundUser = await userModel.findAll();
    res.json({ listagem: foundUser });
  }catch (error) {
      return res.status(500).json({
         message: "Ocorreu um erro ao listar os Usuários"         
      });
  }finally {
    await userModel.closeConection();
  }
}

async function loginRouteHandler(req, res, username, password) {
  try {
    const foundUser = await userModel.findAll({ where: { username: username } });

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

  } catch (error) {
    return res.status(500).json({
      message: "ocorreu um erro",
      error: error
    });
  } finally {
    await userModel.closeConection();
  }
}

async function registerRouteHandler(req, res, username, name, email, password) {
  const foundUser = await userModel.findAll({ username: username });

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
  } finally {
    await userModel.closeConection();
  }
}

async function forgotPasswordRouteHandler(req, res) {
  const { email } = req.body;

  try {
    const foundUser = await userModel.findAll({ email: email });
    if (!foundUser) {
      return res.status(400).json({
        error: { email: ["O e-mail não corresponde a nenhum usuário existente."] },
      });
    } else {
      const token = randomToken(20);
      const infomail = {
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: "Redefinir senha",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <h2 style="color: #333;">Redefinir senha</h2>
            <p style="font-size: 16px;">Você solicitou a alteração de sua senha. Caso essa solicitação não tenha sido feita por você, entre em contato conosco.</p>
            <p style="font-size: 16px;">Acesse <a href="${process.env.APP_URL_CLIENT}/user/esqueci-senha?token=${token}&email=${email}" style="color: #007bff; text-decoration: none;">este link</a> para redefinir sua senha.</p>
          </div>
        `
      };

      const mailSent = await transporter.sendMail(infomail);
      console.log("Email enviado com sucesso", mailSent);

      const dataSent = {
        data: "password-forgot",
        attributes: {
          redirect_url: `${process.env.APP_URL_API}/esqueci-senha`,
          email: email,
        },
      };

      return res.status(204).json({ data: dataSent });
    }
  } catch (error) {
    console.log({ caiunocatch: error });
    return res.status(500).json({ caiunocatch: "Ocorreu um erro ao processar a solicitação." });
  } finally {
    await userModel.closeConection();
  }
}



async function resetPasswordRouteHandler(req, res, email, password, cPass, token) {
  try {
    const foundUser = await userModel.findAll({ email: email });
    if (!foundUser) {
      return res.status(400).json({
        errors: { email: ["Ocorreu algum erro ao encontrar o email"] },
      });
    }
    // Validar a senha
    if (password.length < 8) {
      return res.status(400).json({
        errors: {
          password: ["A senha deve ter no mínimo 8 caracteres."],
        },
      });
    }
    if (password !== cPass) {
      return res.status(400).json({
        errors: {
          password: ["A senha e a confirmação de senha devem corresponder."],
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await userModel.updateOne(
      { email: foundUser.email },
      { $set: { password: hashedPassword } }
    );
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao redefinir a senha.",
    });
  } finally {
    await userModel.closeConection();
  }
}


module.exports = {
  listRouteHandler,
  loginRouteHandler,
  registerRouteHandler,
  forgotPasswordRouteHandler,
  resetPasswordRouteHandler
}