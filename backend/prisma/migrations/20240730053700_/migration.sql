/*
  Warnings:

  - A unique constraint covering the columns `[card_login]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_card_login_key" ON "Card"("card_login");
