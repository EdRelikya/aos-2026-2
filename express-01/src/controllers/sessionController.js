import jwt from "jsonwebtoken";
import { userService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

const login = async (req, res) => {
  const { login, password } = req.body;

  const user = await userService.getUserByLogin(login);

  // Mesma mensagem para usuário inexistente e senha errada (não revela qual falhou)
  if (!user || !(await user.validatePassword(password))) {
    throw new AppError("Credenciais inválidas.", 401);
  }

  const token = generateAccessToken(user);

  return res.status(200).send({
    status: "success",
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    },
  });
};

const getSession = async (req, res) => {
  return res.status(200).send(req.context.me);
};

export default {
  login,
  getSession,
};