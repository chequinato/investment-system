
import { prisma } from "../prisma/prismaClient";
import historicoServices = require("./historicoServices");

interface CriarCompraDTO {
  ticker: string;
  quantidade: number;
  precoUnitario: number;
  userId: number;
}

export async function criarCompra(data: CriarCompraDTO) {
  const valorTotal = data.quantidade * data.precoUnitario;

  const compra = await prisma.compra.create({
    data: {
      ticker: data.ticker,
      quantidade: data.quantidade,
      precoUnitario: data.precoUnitario,
      valorTotal,
      userId: data.userId
    }
  });

  await historicoServices.registrarHistorico({
    tipo: "COMPRA_CRIADA",
    descricao: `Compra criada: ${data.ticker} (${data.quantidade} ações)`,
    userId: data.userId,
    compraId: compra.id
  });

  return compra;
}

export async function listarCompras(userId: number) {
  return prisma.compra.findMany({
    where: { userId },
    include: { pagamento: true }
  });
}