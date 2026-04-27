import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === 'production';
const envDatabaseUrl = process.env.DATABASE_URL;
export const databaseUrl = envDatabaseUrl ?? (!isProduction ? 'file:./dev.db' : undefined);

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

export const prisma = databaseUrl ? global.prisma ?? new PrismaClient() : undefined;

if (process.env.NODE_ENV !== 'production' && prisma) {
  global.prisma = prisma;
}
