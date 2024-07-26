-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('RUB');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'SUCCESS', 'ERROR', 'EXITED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('default', 'sberbank', 'alfabank', 'tinkoff', 'raiffeisen');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "merchant_id" INTEGER NOT NULL,
    "secret_key" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "Status" NOT NULL,
    "description" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_at" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "time_opened" TEXT NOT NULL,
    "timezone" INTEGER NOT NULL,
    "browser_version" TEXT NOT NULL,
    "browser_language" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "session_uid" TEXT NOT NULL,
    "time_closed" TEXT,
    "time_paid" TEXT,
    "from" TEXT,
    "card_id" INTEGER NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "card_number" TEXT NOT NULL,
    "card_holder" TEXT NOT NULL,
    "card_receiver" TEXT NOT NULL,
    "card_cvv" TEXT NOT NULL,
    "card_valid_thru" TEXT NOT NULL,
    "card_phone" TEXT NOT NULL,
    "card_login" TEXT NOT NULL,
    "card_password" TEXT NOT NULL,
    "card_pin" TEXT NOT NULL,
    "card_secret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "busy" BOOLEAN NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_uid_key" ON "Merchant"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Session_uid_key" ON "Session"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_session_uid_key" ON "Payment"("session_uid");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_session_uid_fkey" FOREIGN KEY ("session_uid") REFERENCES "Session"("uid") ON DELETE RESTRICT ON UPDATE NO ACTION;
