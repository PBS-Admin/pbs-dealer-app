import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  try {
    // Use NextAuth's getToken instead of manual JWT verification
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session || !token) {
      console.log('No valid session or token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get List of all Companies
    const compResult = await query('SELECT ID, Name FROM Dealer_Company');

    const parsedCompanies = compResult.map((companies) => ({
      ...companies,
      ID: companies.ID,
      Name: companies.Name,
    }));

    const status = await getPoolStatus();

    return NextResponse.json(
      // { quotes: parsedQuotes },
      { companies: parsedCompanies },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching quotes' },
      { status: 500 }
    );
  }
}
