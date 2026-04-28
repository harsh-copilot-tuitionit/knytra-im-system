import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/db';
import { dbUnavailableResponse } from '../../../../../../lib/api-utils';
import { authorizeWorker } from '../../../../../../lib/worker-auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const authError = authorizeWorker(request);
  if (authError) return authError;
  if (!prisma) return dbUnavailableResponse();

  const { id } = params;
  const job = await prisma.outreachJob.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'queued') {
    return NextResponse.json({ error: 'Job must be queued to start' }, { status: 400 });
  }

  const updated = await prisma.outreachJob.update({
    where: { id },
    data: {
      status: 'running',
      startedAt: new Date(),
    },
  });

  await prisma.automationLog.create({
    data: {
      jobId: updated.id,
      level: 'info',
      message: `Started outreach job ${updated.id}`,
    },
  });

  return NextResponse.json(updated);
}
