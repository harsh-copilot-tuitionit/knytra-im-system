import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  const leads = await prisma.influencerLead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      submittedBy: true,
      assignedAccount: true,
    },
  });

  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { instagramUsername, niche, followerRange, location, notes } = payload;

  if (!instagramUsername || !niche || !followerRange || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existing = await prisma.influencerLead.findUnique({
    where: { instagramUsername: instagramUsername.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json({ error: 'This Instagram username already exists' }, { status: 409 });
  }

  const submitter = await prisma.user.findFirst({ where: { role: 'intern' } });
  if (!submitter) {
    return NextResponse.json({ error: 'No intern user available' }, { status: 500 });
  }

  const lead = await prisma.influencerLead.create({
    data: {
      instagramUsername: instagramUsername.toLowerCase(),
      niche,
      followerRange,
      location,
      notes,
      status: 'new',
      submittedById: submitter.id,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
