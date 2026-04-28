import { NextResponse } from 'next/server';

const workerSecret = process.env.WORKER_SECRET;

export function authorizeWorker(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

  if (!workerSecret) {
    return NextResponse.json({ error: 'Worker secret not configured' }, { status: 500 });
  }

  if (!token || token !== workerSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
