import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  const logs = await prisma.automationLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      job: true,
    },
  });
  return NextResponse.json(logs);
}
