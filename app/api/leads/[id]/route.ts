import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { assignOutreachAccount } from '../../../../lib/account-assignment';

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

  const lead = await prisma.influencerLead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  if (status === 'queued') {
    const existingJob = await prisma.outreachJob.findFirst({
      where: {
        leadId: id,
        status: { in: ['queued', 'running', 'completed'] },
      },
      include: { account: true },
    });

    if (existingJob) {
      await prisma.influencerLead.update({
        where: { id },
        data: {
          status: 'queued',
          assignedAccountId: existingJob.accountId,
        },
      });
      return NextResponse.json(existingJob);
    }

    const account = await assignOutreachAccount(prisma);
    if (!account) {
      return NextResponse.json({ error: 'No active outreach account available' }, { status: 400 });
    }

    const job = await prisma.outreachJob.create({
      data: {
        leadId: id,
        accountId: account.id,
        status: 'queued',
        attemptCount: 0,
        scheduledAt: new Date(),
      },
    });

    await prisma.automationLog.create({
      data: {
        jobId: job.id,
        level: 'info',
        message: `Queued outreach job for @${lead.instagramUsername} using ${account.label}`,
      },
    });

    const updatedLead = await prisma.influencerLead.update({
      where: { id },
      data: {
        status: 'queued',
        assignedAccountId: account.id,
      },
    });

    return NextResponse.json({ ...job, lead: updatedLead, account });
  }

  const updates: any = { status };
  if (status === 'rejected') {
    updates.rejectionReason = rejectionReason ?? 'Rejected by admin';
  }

  const updatedLead = await prisma.influencerLead.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json(updatedLead);
}
