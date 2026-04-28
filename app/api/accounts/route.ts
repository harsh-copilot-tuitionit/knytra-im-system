import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { dbUnavailableResponse, handleApiError } from '../../../lib/api-utils';

const validStatuses = ['active', 'warming', 'paused', 'blocked'];

export async function GET() {
  if (!prisma) return dbUnavailableResponse();

  try {
    const accounts = await prisma.outreachAccount.findMany({
      orderBy: { label: 'asc' },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  if (!prisma) return dbUnavailableResponse();

  try {
    const payload = await request.json();
    const { label, username, status, dailyLimit, healthNotes } = payload;

    if (!label || !username || !status) {
      return NextResponse.json({ error: 'Missing required account fields' }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid account status' }, { status: 400 });
    }

    const account = await prisma.outreachAccount.create({
      data: {
        label,
        username,
        status,
        dailyLimit: Number(dailyLimit ?? 0),
        messagesSentToday: 0,
        healthNotes: healthNotes ?? '',
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
