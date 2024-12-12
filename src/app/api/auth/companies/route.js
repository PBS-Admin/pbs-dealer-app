import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  try {
    // Use NextAuth's getToken instead of manual JWT verification
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permission level
    if (session.user.permission < 3) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get List of all Companies
    const compResult = await query('SELECT ID, Name FROM Dealer_Company');

    const companies = compResult.map((company) => ({
      ID: company.ID,
      Name: company.Name,
    }));

    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error('Error in companies GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching companies' },
      { status: 500 }
    );
  }
}
