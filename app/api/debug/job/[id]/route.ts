import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { dbUnavailableResponse, handleApiError } from '../../../../../lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!prisma) return dbUnavailableResponse();

  try {
    const { id } = params;
    const job = await prisma.outreachJob.findUnique({
      where: { id },
      include: {
        lead: true,
        account: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
        leadUsername: job.lead.instagramUsername,
        leadStatus: job.lead.status,
        accountLabel: job.account.label,
        accountMessagesSentToday: job.account.messagesSentToday,
        recentLogs: job.logs.map((log) => ({
          id: log.id,
          level: log.level,
          message: log.message,
          createdAt: log.createdAt,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
