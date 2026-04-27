import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  const accounts = await prisma.outreachAccount.findMany({
    orderBy: { label: 'asc' },
  });
  return NextResponse.json(accounts);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { label, username, status, dailyLimit, healthNotes } = payload;

  if (!label || !username || !status) {
    return NextResponse.json({ error: 'Missing required account fields' }, { status: 400 });
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
}
