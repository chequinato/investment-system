import { prisma } from "../prisma/prismaClient";

export default {
  async criarCarteira(data: any) {
    return prisma.carteira.create({ data });
  },
  async listarCarteiras() {
    return prisma.carteira.findMany();
  },
  async buscarCarteiraPorId(id: number) {
    return prisma.carteira.findUnique({ where: { id } });
  },
  async atualizarCarteira(id: number, data: any) {
    return prisma.carteira.update({ where: { id }, data });
  },
  async deletarCarteira(id: number) {
    return prisma.carteira.delete({ where: { id } });
  },
  async resumoCarteira(userId: number) {
    const compras = await prisma.compra.findMany({ where: { userId } });
    const mapa: any = {};
    compras.forEach((compra) => {
      if (!mapa[compra.ticker]) {
        mapa[compra.ticker] = {
          ticker: compra.ticker,
          quantidade: 0,
          totalInvestido: 0
        };
      }
      mapa[compra.ticker].quantidade += compra.quantidade;
      mapa[compra.ticker].totalInvestido += compra.valorTotal;
    });
    const resultado = Object.values(mapa).map((item: any) => ({
      ticker: item.ticker,
      quantidade: item.quantidade,
      precoMedio: item.totalInvestido / item.quantidade,
      totalInvestido: item.totalInvestido
    }));
    return resultado;
  }
};

