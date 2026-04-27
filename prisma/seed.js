const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@knytra.com' },
    update: { name: 'Admin User', role: 'admin' },
    create: { name: 'Admin User', email: 'admin@knytra.com', role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'intern@knytra.com' },
    update: { name: 'Intern User', role: 'intern' },
    create: { name: 'Intern User', email: 'intern@knytra.com', role: 'intern' },
  });

  const accounts = [
    { label: 'Knytra Outreach 1', username: '@knytra_outreach1', status: 'active', dailyLimit: 500, healthNotes: 'Ready for outreach' },
    { label: 'Knytra Outreach 2', username: '@knytra_outreach2', status: 'active', dailyLimit: 450, healthNotes: 'Stable account' },
    { label: 'Knytra Outreach 3', username: '@knytra_outreach3', status: 'warming', dailyLimit: 300, healthNotes: 'Warming up' },
    { label: 'Knytra Outreach 4', username: '@knytra_outreach4', status: 'paused', dailyLimit: 0, healthNotes: 'Account paused for review' },
    { label: 'Knytra Outreach 5', username: '@knytra_outreach5', status: 'blocked', dailyLimit: 0, healthNotes: 'Blocked by Instagram' },
  ];

  for (const account of accounts) {
    const existingAccount = await prisma.outreachAccount.findFirst({
      where: { username: account.username },
    });

    if (!existingAccount) {
      await prisma.outreachAccount.create({
        data: { ...account, messagesSentToday: 0 },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
