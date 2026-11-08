import { z } from "zod";

const REQUIRED = "Campo obrigatório";

// String obrigatória: campo ausente vira "Campo obrigatório"
const requiredString = (label) =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? REQUIRED : `${label} deve ser um texto`,
  });

const uuidV4 = () =>
  z.uuid({
    version: "v4",
    error: "Identificador inválido: informe um UUID v4 válido",
  });

export const createUserSchema = z.object({
  body: z.object({
    username: requiredString("username")
      .trim()
      .min(1, { error: "Não pode ser vazio" }),
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? REQUIRED : "Formato de e-mail inválido",
    }),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: uuidV4(),
  }),
});

export const createMessageSchema = z.object({
  body: z.object({
    text: requiredString("text")
      .trim()
      .min(1, { error: "Não pode ser vazio" })
      .max(1000, { error: "Máximo de 1000 caracteres" }),
  }),
});

export const messageIdParamSchema = z.object({
  params: z.object({
    messageId: uuidV4(),
  }),
});

// ---------- Tarefas ----------

// A coluna é VARCHAR(255): sem esse limite, um texto maior viraria erro 500 no banco
const descricaoSchema = () =>
  requiredString("descricao")
    .trim()
    .min(1, { error: "Não pode ser vazio" })
    .max(255, { error: "Máximo de 255 caracteres" });

const concluidaSchema = () =>
  z.boolean({ error: "concluida deve ser true ou false" });

export const createTarefaSchema = z.object({
  body: z.object({
    descricao: descricaoSchema(),
    concluida: concluidaSchema().default(false),
  }),
});

export const updateTarefaSchema = z.object({
  body: z
    .object({
      descricao: descricaoSchema().optional(),
      concluida: concluidaSchema().optional(),
    })
    .refine(
      (body) => body.descricao !== undefined || body.concluida !== undefined,
      { error: "Informe descricao e/ou concluida" },
    ),
});

export const tarefaIdParamSchema = z.object({
  params: z.object({
    objectId: uuidV4(),
  }),
});