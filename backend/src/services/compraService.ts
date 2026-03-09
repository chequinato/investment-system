
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

  // Cria a compra normalmente
  const compra = await prisma.compra.create({
    data: {
      ticker: data.ticker,
      quantidade: data.quantidade,
      precoUnitario: data.precoUnitario,
      valorTotal,
      userId: data.userId
    }
  });

  // Atualiza ou cria o registro na tabela Carteira
  const carteiraExistente = await prisma.carteira.findFirst({
    where: {
      ticker: data.ticker,
      userId: data.userId
    }
  });

  if (carteiraExistente) {
    // Atualiza quantidade, totalInvestido e precoMedio
    const novaQuantidade = carteiraExistente.quantidade + data.quantidade;
    const novoTotalInvestido = carteiraExistente.totalInvestido + valorTotal;
    const novoPrecoMedio = novoTotalInvestido / novaQuantidade;
    await prisma.carteira.update({
      where: { id: carteiraExistente.id },
      data: {
        quantidade: novaQuantidade,
        totalInvestido: novoTotalInvestido,
        precoMedio: novoPrecoMedio
      }
    });
  } else {
    // Cria novo registro na carteira
    await prisma.carteira.create({
      data: {
        ticker: data.ticker,
        quantidade: data.quantidade,
        totalInvestido: valorTotal,
        precoMedio: data.precoUnitario,
        userId: data.userId
      }
    });
  }

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