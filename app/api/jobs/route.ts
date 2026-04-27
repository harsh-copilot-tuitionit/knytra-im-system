import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { dbUnavailableResponse, handleApiError } from '../../../lib/api-utils';

export async function GET() {
  if (!prisma) return dbUnavailableResponse();

  try {
    const jobs = await prisma.outreachJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
        account: true,
      },
    });

    const mapped = jobs.map((job) => ({
      id: job.id,
      status: job.status,
      scheduledAt: job.scheduledAt,
      attemptCount: job.attemptCount,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      leadInstagramUsername: job.lead.instagramUsername,
      accountLabel: job.account.label,
      accountUsername: job.account.username,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}
