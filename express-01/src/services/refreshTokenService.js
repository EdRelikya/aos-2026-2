import crypto from "node:crypto";
import models from "../models/index.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Cria um refresh token opaco (40 bytes aleatórios) e devolve o texto dele
const createRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");

  await models.RefreshToken.create({
    token,
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return token;
};

// Rotação: apaga o token e devolve o usuário dono dele.
// Devolve null se o token não existe, já foi usado ou está expirado.
const consumeRefreshToken = async (token) => {
  const stored = await models.RefreshToken.findOne({
    where: { token },
    include: [{ model: models.User }],
  });

  if (!stored) {
    return null;
  }

  // Se outra requisição apagou o token no meio do caminho, a contagem é 0
  const deleted = await models.RefreshToken.destroy({
    where: { id: stored.id },
  });

  if (deleted === 0 || stored.expiresAt < new Date() || !stored.user) {
    return null;
  }

  return stored.user;
};

// Logout: apaga o refresh token informado
const revokeRefreshToken = async (token) => {
  const count = await models.RefreshToken.destroy({
    where: { token },
  });
  return count > 0;
};

export default {
  createRefreshToken,
  consumeRefreshToken,
  revokeRefreshToken,
};