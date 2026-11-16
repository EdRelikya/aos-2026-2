import { Router } from "express";
import { sessionController } from "../controllers/index.js";
import {
  authLimiterMiddleware,
  authMiddleware,
  validate,
} from "../middlewares/index.js";
import {
  loginSchema,
  refreshTokenSchema,
} from "../middlewares/validationSchemas.js";

const router = Router();

router.post(
  "/",
  authLimiterMiddleware,
  validate(loginSchema),
  sessionController.login,
);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  sessionController.refresh,
);
router.get("/", authMiddleware, sessionController.getSession);
router.delete("/", validate(refreshTokenSchema), sessionController.logout);

export default router;