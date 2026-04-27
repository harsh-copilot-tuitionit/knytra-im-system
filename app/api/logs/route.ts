import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { dbUnavailableResponse, handleApiError } from '../../../lib/api-utils';

export async function GET() {
  if (!prisma) return dbUnavailableResponse();

  try {
    const logs = await prisma.automationLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
      },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return handleApiError(error);
  }
}
