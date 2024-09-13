import { NextResponse } from 'next/server';
import { query, manualCleanup } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No bearer token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const company = searchParams.get('company');

    if (!company) {
      console.log('No company provided, returning 400');
      return NextResponse.json(
        { error: 'Company parameter is required' },
        { status: 400 }
      );
    }

    if (decodedToken.company !== company) {
      console.log('Company mismatch, returning 403');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only select the columns we need
    const result = await query(
      'SELECT ID, Submitted, Quote, Rev, Customer, ProjectName, DateStarted FROM Quotes WHERE Company = ? AND Active = 1',
      [company]
    );

    // Parse QuoteData for each quote
    const parsedQuotes = result.map((quote) => ({
      ...quote,
      ID: quote.ID,
      Submitted: quote.Submitted,
      Quote: quote.Quote,
      Rev: quote.Rev,
      Customer: quote.Customer,
      ProjectName: quote.ProjectName,
      DateStarted: quote.DateStarted,
    }));

    if (process.env.NODE_ENV === 'development') {
      await manualCleanup();
    }

    return NextResponse.json({ quotes: parsedQuotes }, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching quotes' },
      { status: 500 }
    );
  }
}
