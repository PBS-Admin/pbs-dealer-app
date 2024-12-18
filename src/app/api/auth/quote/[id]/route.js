import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    let quoteQuery = 'SELECT * FROM Dealer_Quotes WHERE ID = ? AND Status & 1';
    let queryParams = [id];

    if (session.user.permission < 3) {
      quoteQuery += ' AND Company = ?';
      queryParams.push(session.user.company);
    }

    const result = await query(quoteQuery, queryParams);

    if (result.length === 0) {
      const quoteExists = await query(
        'SELECT ID FROM Dealer_Quotes WHERE ID = ? AND Status & 1',
        [id]
      );

      if (quoteExists.length === 0) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      } else {
        return NextResponse.json(
          { error: 'You do not have permission to view this quote' },
          { status: 403 }
        );
      }
    }

    // Get company name in same query process
    const companyInfo = await query(
      'SELECT Name FROM Dealer_Company WHERE ID = ?',
      [result[0].Company]
    );

    const quote = {
      ...result[0],
      companyName: companyInfo[0]?.Name || 'Unknown Company',
    };

    return NextResponse.json({ quote }, { status: 200 });
  } catch (error) {
    console.error('Error in quote GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the quote' },
      { status: 500 }
    );
  }
}
