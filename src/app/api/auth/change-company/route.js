import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newCompany } = await request.json();

    return NextResponse.json({
      success: true,
      company: newCompany,
    });
  } catch (error) {
    console.error('Error changing company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
