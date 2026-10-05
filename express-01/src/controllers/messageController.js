import { messageService } from "../services/index.js";
import AppError from "../utils/appError.js";

const getMessages = async (req, res) => {
  const messages = await messageService.getAllMessages();
  // 200 OK: Sucesso padrão para listagens
  return res.status(200).send(messages);
};

const getMessage = async (req, res) => {
  const message = await messageService.getMessageById(req.params.messageId);

  if (!message) {
    throw new AppError("Mensagem não encontrada.", 404);
  }

  // 200 OK: Sucesso para busca de item único
  return res.status(200).send(message);
};

const createMessage = async (req, res) => {
  const message = await messageService.createMessage({
    text: req.body.text,
    userId: req.context.me.id,
  });

  // 201 Created: Sucesso específico para quando um recurso é criado no banco
  return res.status(201).send(message);
};

const updateMessage = async (req, res) => {
  const updatedMessage = await messageService.updateMessage(req.params.messageId, {
    text: req.body.text,
  });

  if (!updatedMessage) {
    throw new AppError("Mensagem não encontrada.", 404);
  }

  // 200 OK: Sucesso para atualizações onde você retorna o objeto modificado
  return res.status(200).send(updatedMessage);
};

const deleteMessage = async (req, res) => {
  await messageService.deleteMessage(req.params.messageId);

  // 204 No Content: O recurso foi deletado com sucesso e não há nada para retornar no corpo.
  // Nota: Se usar 204, o navegador ignora o .send(true) pois não pode haver corpo.
  return res.status(204).send();
};

export default {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};