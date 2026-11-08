import { tarefaService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const listarTarefas = async (req, res) => {
  const tarefas = await tarefaService.listarTarefas();
  return res.status(200).send(tarefas);
};

const buscarTarefa = async (req, res) => {
  const tarefa = await tarefaService.buscarTarefaPorId(req.params.objectId);
  if (!tarefa) {
    throw new AppError("Tarefa não encontrada.", 404);
  }
  return res.status(200).send(tarefa);
};

const criarTarefa = async (req, res) => {
  const { descricao, concluida } = req.body || {};
  const tarefa = await tarefaService.criarTarefa({ descricao, concluida });
  return res.status(201).send(tarefa);
};

const atualizarTarefa = async (req, res) => {
  const { descricao, concluida } = req.body || {};
  const tarefa = await tarefaService.atualizarTarefa(req.params.objectId, {
    descricao,
    concluida,
  });
  if (!tarefa) {
    throw new AppError("Tarefa não encontrada.", 404);
  }
  return res.status(200).send(tarefa);
};

const excluirTarefa = async (req, res) => {
  const excluida = await tarefaService.excluirTarefa(req.params.objectId);
  if (!excluida) {
    throw new AppError("Tarefa não encontrada.", 404);
  }
  return res.status(204).send();
};

export default {
  listarTarefas,
  buscarTarefa,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
};