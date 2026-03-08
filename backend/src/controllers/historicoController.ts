import { prisma } from "../prisma/prismaClient";

export async function listarHistorico(req, res) {
  const historico = await prisma.historico.findMany({
    include: {
      user: true,
      compra: true,
      pagamento: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(historico);
}