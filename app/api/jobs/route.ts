import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  const jobs = await prisma.outreachJob.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      lead: true,
      account: true,
    },
  });
  return NextResponse.json(jobs);
}
