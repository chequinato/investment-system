
import { prisma } from "../prisma/prismaClient";


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
  return compra;
}


export async function listarCompras(userId: number) {
  return prisma.compra.findMany({
    where: { userId },
    include: { pagamento: true }
  });
}