import { NextResponse } from 'next/server';

export function dbUnavailableResponse() {
  return NextResponse.json(
    {
      error: 'Database unavailable. Ensure DATABASE_URL is configured in production.',
    },
    { status: 500 },
  );
}

export function handleApiError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      error: 'A database error occurred. Check server logs for details.',
    },
    { status: 500 },
  );
}
