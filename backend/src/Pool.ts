import { PrismaClient } from "@prisma/client";
export class Pool {
    static X = new PrismaClient();
}
new Pool()