import { Router } from "express";
import { messageController } from "../controllers/index.js";
import { validate } from "../middlewares/index.js";
import {
  createMessageSchema,
  messageIdParamSchema,
} from "../middlewares/validationSchemas.js";

const router = Router();

router.get("/", messageController.getMessages);
router.get(
  "/:messageId",
  validate(messageIdParamSchema),
  messageController.getMessage,
);
router.post("/", validate(createMessageSchema), messageController.createMessage);
router.put(
  "/:messageId",
  validate(messageIdParamSchema),
  messageController.updateMessage,
);
router.delete(
  "/:messageId",
  validate(messageIdParamSchema),
  messageController.deleteMessage,
);

export default router;