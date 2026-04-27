const { spawnSync } = require('child_process');
const { join, dirname } = require('path');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:./dev.db';
  console.warn('DATABASE_URL not set, falling back to file:./dev.db for Prisma generate.');
}

const prismaIndex = require.resolve('prisma');
const result = spawnSync(process.execPath, [prismaIndex, 'generate'], {
  stdio: 'inherit',
  env,
});

if (result.error) {
  console.error('Prisma generate failed:', result.error);
}

process.exit(result.status === null ? 1 : result.status);
