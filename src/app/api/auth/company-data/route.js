import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const status = await getPoolStatus();
    console.log('Pool status:', status);
    if (!session || !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const company = searchParams.get('company');

    const compResult = await query(
      'SELECT ID, Name, Terms, Initials, Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8 FROM Dealer_Company WHERE ID = ?',
      [company]
    );

    if (!compResult.length) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company: compResult[0] }, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching company data' },
      { status: 500 }
    );
  }
}
