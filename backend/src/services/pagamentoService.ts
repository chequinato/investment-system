
import { prisma } from "../prisma/prismaClient";


export async function criarPagamento(compraId: number, valor: number, userId: number) {
  const pagamento = await prisma.pagamento.create({
    data: {
      compraId,
      valor,
      status: "PENDENTE",
      userId
    }
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

  return pagamento;

}


export async function listarPagamentos(userId: number) {
  return await prisma.pagamento.findMany({ where: { userId } });
}