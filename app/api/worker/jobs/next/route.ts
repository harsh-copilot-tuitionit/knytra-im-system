import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { dbUnavailableResponse } from '../../../../../lib/api-utils';
import { authorizeWorker } from '../../../../../lib/worker-auth';

export async function GET(request: Request) {
  const authError = authorizeWorker(request);
  if (authError) return authError;
  if (!prisma) return dbUnavailableResponse();

  const url = new URL(request.url);
  const accountId = url.searchParams.get('accountId') ?? undefined;

  const where: any = {
    status: 'queued',
    account: {
      status: 'active',
    },
  };

  if (accountId) {
    where.accountId = accountId;
  }

  const job = await prisma.outreachJob.findFirst({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      lead: true,
      account: true,
    },
  });

  if (!job) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    jobId: job.id,
    leadId: job.leadId,
    instagramUsername: job.lead.instagramUsername,
    accountId: job.accountId,
    accountLabel: job.account.label,
    accountUsername: job.account.username,
  });
}
