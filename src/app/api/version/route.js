import { APP_VERSION } from '../../../../version';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ version: APP_VERSION });
}
