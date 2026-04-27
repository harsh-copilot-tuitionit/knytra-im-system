import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { status, rejectionReason } = body;

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const validStatuses = ['approved', 'rejected', 'queued', 'do_not_contact'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status action' }, { status: 400 });
  }

  const updates: any = { status };
  if (status === 'rejected') {
    updates.rejectionReason = rejectionReason ?? 'Rejected by admin';
  }

  const lead = await prisma.influencerLead.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json(lead);
}
