-- CreateTable
CREATE TABLE "Carteira" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticker" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoMedio" REAL NOT NULL,
    "totalInvestido" REAL NOT NULL
);
