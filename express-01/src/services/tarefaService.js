import models from "../models/index.js";

const listarTarefas = async () => {
  return await models.Tarefa.findAll({ order: [["createdAt", "ASC"]] });
};

const buscarTarefaPorId = async (objectId) => {
  return await models.Tarefa.findByPk(objectId);
};

const criarTarefa = async ({ descricao, concluida }) => {
  return await models.Tarefa.create({
    descricao,
    ...(concluida !== undefined && { concluida }),
  });
};

const atualizarTarefa = async (objectId, { descricao, concluida }) => {
  const tarefa = await buscarTarefaPorId(objectId);
  if (!tarefa) {
    return null;
  }
  return await tarefa.update({
    ...(descricao !== undefined && { descricao }),
    ...(concluida !== undefined && { concluida }),
  });
};

const excluirTarefa = async (objectId) => {
  const count = await models.Tarefa.destroy({
    where: { objectId },
  });
  return count > 0;
};

export default {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
};