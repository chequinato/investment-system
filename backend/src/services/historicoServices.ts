
import { prisma } from "../prisma/prismaClient";


export async function registrarHistorico({
  tipo,
  descricao,
  userId,
  compraId,
  pagamentoId
}: {
  tipo: string
  descricao: string
  userId: number
  compraId?: number
  pagamentoId?: number
}) {
  return prisma.historico.create({
    data: {
      tipo,
      descricao,
      userId,
      compraId,
      pagamentoId
    }
  });
}