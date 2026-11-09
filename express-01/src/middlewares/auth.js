import jwt from "jsonwebtoken";
import { userService } from "../services/index.js";
import { AppError } from "../utils/index.js";

// Exige "Authorization: Bearer <token>" e coloca o usuário em req.context.me
const authMiddleware = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new AppError("Token de autenticação não fornecido.", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token de autenticação expirado."
        : "Token de autenticação inválido.";
    throw new AppError(message, 401);
  }

  const user = await userService.getUserById(payload.id);
  if (!user) {
    throw new AppError("Usuário do token não encontrado.", 401);
  }

  req.context = { ...req.context, me: user };
  next();
};

export default authMiddleware;