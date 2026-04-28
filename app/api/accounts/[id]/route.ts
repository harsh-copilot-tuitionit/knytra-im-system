import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { dbUnavailableResponse, handleApiError } from '../../../../lib/api-utils';

const validStatuses = ['active', 'warming', 'paused', 'blocked'];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!prisma) return dbUnavailableResponse();

  try {
    const { id } = params;
    const payload = await request.json();
    const updates: any = {};

    if (payload.status !== undefined) {
      if (!validStatuses.includes(payload.status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      updates.status = payload.status;
    }

    if (payload.dailyLimit !== undefined) {
      const dailyLimit = Number(payload.dailyLimit);
      if (Number.isNaN(dailyLimit) || dailyLimit < 0) {
        return NextResponse.json({ error: 'dailyLimit must be a number greater than or equal to 0' }, { status: 400 });
      }
      updates.dailyLimit = dailyLimit;
    }

    if (payload.messagesSentToday !== undefined) {
      const messagesSentToday = Number(payload.messagesSentToday);
      if (Number.isNaN(messagesSentToday) || messagesSentToday < 0) {
        return NextResponse.json({ error: 'messagesSentToday must be a number greater than or equal to 0' }, { status: 400 });
      }
      updates.messagesSentToday = messagesSentToday;
    }

    if (payload.healthNotes !== undefined) {
      updates.healthNotes = String(payload.healthNotes);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }

    const updated = await prisma.outreachAccount.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
