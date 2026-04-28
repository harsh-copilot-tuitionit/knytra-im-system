import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/db';
import { dbUnavailableResponse } from '../../../../../../lib/api-utils';
import { authorizeWorker } from '../../../../../../lib/worker-auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const authError = authorizeWorker(request);
  if (authError) return authError;
  if (!prisma) return dbUnavailableResponse();

  const { id } = params;
  const body = await request.json();
  const errorMessage = body.errorMessage || 'Job failed';

  const job = await prisma.outreachJob.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const updatedJob = await prisma.outreachJob.update({
    where: { id },
    data: {
      status: 'failed',
      errorMessage,
      completedAt: new Date(),
    },
  });

  await prisma.automationLog.create({
    data: {
      jobId: updatedJob.id,
      level: 'error',
      message: `Outreach job ${updatedJob.id} failed: ${errorMessage}`,
    },
  });

  return NextResponse.json(updatedJob);
}
