import { PrismaClient } from '@prisma/client';

export async function assignOutreachAccount(prisma: PrismaClient) {
  const activeAccounts = await prisma.outreachAccount.findMany({
    where: { status: 'active' },
    orderBy: { messagesSentToday: 'asc' },
  });

  return activeAccounts.find((account) => account.messagesSentToday < account.dailyLimit) ?? null;
}
