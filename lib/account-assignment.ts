import { PrismaClient } from '@prisma/client';

export async function assignOutreachAccount(prisma: PrismaClient) {
  const activeAccounts = await prisma.outreachAccount.findMany({
    where: { status: 'active' },
  });

  const availableAccounts = activeAccounts
    .map((account) => ({
      ...account,
      remainingLimit: account.dailyLimit - account.messagesSentToday,
    }))
    .filter((account) => account.remainingLimit > 0);

  if (availableAccounts.length === 0) {
    return null;
  }

  const highestRemaining = Math.max(...availableAccounts.map((account) => account.remainingLimit));
  const bestAccounts = availableAccounts.filter((account) => account.remainingLimit === highestRemaining);
  const randomIndex = Math.floor(Math.random() * bestAccounts.length);

  return bestAccounts[randomIndex] ?? null;
}
