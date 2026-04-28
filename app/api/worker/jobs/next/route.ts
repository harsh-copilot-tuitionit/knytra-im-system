import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { dbUnavailableResponse } from '../../../../../lib/api-utils';
import { authorizeWorker } from '../../../../../lib/worker-auth';

export async function GET(request: Request) {
  const authError = authorizeWorker(request);
  if (authError) return authError;
  if (!prisma) return dbUnavailableResponse();

  const job = await prisma.outreachJob.findFirst({
    where: { status: 'queued' },
    orderBy: { createdAt: 'asc' },
    include: {
      lead: true,
      account: true,
    },
  });

  if (!job) {
    return NextResponse.json(null);
  }

  return NextResponse.json(job);
}
