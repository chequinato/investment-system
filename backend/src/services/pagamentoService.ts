
import { prisma } from "../prisma/prismaClient";
import * as historicoServices from "./historicoServices";

export async function criarPagamento(compraId: number, valor: number, userId: number) {

  const pagamento = await prisma.pagamento.create({
    data: {
      compraId,
      valor,
      status: "PENDENTE",
      userId
    }
  });

  await historicoServices.registrarHistorico({
    tipo: "PAGAMENTO_CRIADO",
    descricao: `Pagamento criado no valor de ${valor}`,
    userId: userId,
    pagamentoId: pagamento.id
  });

  return pagamento;
}

export async function processarPagamento(id: number, sucesso: boolean) {

  const pagamento = await prisma.pagamento.update({
    where: { id },
    data: {
      status: sucesso ? "EXECUTADO" : "CANCELADO",
      dataExecucao: new Date()
    }
  });

  await historicoServices.registrarHistorico({
    tipo: sucesso ? "PAGAMENTO_EXECUTADO" : "PAGAMENTO_CANCELADO",
    descricao: sucesso ? "Pagamento executado" : "Pagamento cancelado",
    userId: pagamento.userId,
    pagamentoId: pagamento.id
  });

  return pagamento;
}

export async function listarPagamentos(userId: number) {
  return prisma.pagamento.findMany({
    where: { userId }
  });
}