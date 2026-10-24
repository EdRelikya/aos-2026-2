import cors from "cors";

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim());

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Sem Origin: apps mobile (Expo/React Native), Postman, cURL
    if (!origin) {
      return callback(null, true);
    }

    // Origem na lista permitida
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Origem não permitida: nega sem lançar erro
    return callback(null, false);
  },
  credentials: true,
});

export default corsMiddleware;