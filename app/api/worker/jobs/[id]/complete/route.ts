import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/db';
import { dbUnavailableResponse } from '../../../../../../lib/api-utils';
import { authorizeWorker } from '../../../../../../lib/worker-auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const authError = authorizeWorker(request);
  if (authError) return authError;
  if (!prisma) return dbUnavailableResponse();

  const { id } = params;
  const job = await prisma.outreachJob.findUnique({
    where: { id },
    include: {
      lead: true,
      account: true,
    },
  });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'running') {
    return NextResponse.json({ error: 'Job must be running to complete' }, { status: 400 });
  }

  const updatedJob = await prisma.outreachJob.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
    include: {
      lead: true,
      account: true,
    },
  });

  await prisma.influencerLead.update({
    where: { id: job.leadId },
    data: {
      status: 'messaged',
    },
  });

  const accountUpdate = await prisma.outreachAccount.update({
    where: { id: job.accountId },
    data: {
      messagesSentToday: job.account.messagesSentToday + 1,
    },
  });

  await prisma.automationLog.create({
    data: {
      jobId: updatedJob.id,
      level: 'info',
      message: `Completed outreach job ${updatedJob.id} for @${job.lead.instagramUsername}`,
    },
  });

  return NextResponse.json({
    jobId: updatedJob.id,
    status: updatedJob.status,
    leadStatus: 'messaged',
    accountMessagesSentToday: accountUpdate.messagesSentToday,
  });
}
