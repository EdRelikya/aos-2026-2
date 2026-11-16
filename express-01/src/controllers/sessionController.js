import jwt from "jsonwebtoken";
import { userService, refreshTokenService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

// Monta a resposta com o par de tokens (usada no login e no refresh)
const issueSession = async (user) => {
  const token = generateAccessToken(user);
  const refreshToken = await refreshTokenService.createRefreshToken(user.id);

  return {
    status: "success",
    data: {
      token,
      refreshToken,
      user: { id: user.id, username: user.username, email: user.email },
    },
  };
};

const login = async (req, res) => {
  const { login, password } = req.body;

  const user = await userService.getUserByLogin(login);

  // Mesma mensagem para usuário inexistente e senha errada (não revela qual falhou)
  if (!user || !(await user.validatePassword(password))) {
    throw new AppError("Credenciais inválidas.", 401);
  }

  return res.status(200).send(await issueSession(user));
};

// Rotação: o refresh token usado é apagado e um novo par é emitido
const refresh = async (req, res) => {
  const user = await refreshTokenService.consumeRefreshToken(
    req.body.refreshToken,
  );

  if (!user) {
    throw new AppError("Refresh token inválido ou expirado.", 401);
  }

  return res.status(200).send(await issueSession(user));
};

// Logout: revoga o refresh token (204 mesmo que ele já não exista)
const logout = async (req, res) => {
  await refreshTokenService.revokeRefreshToken(req.body.refreshToken);
  return res.status(204).send();
};

const getSession = async (req, res) => {
  return res.status(200).send(req.context.me);
};

export default {
  login,
  refresh,
  logout,
  getSession,
};