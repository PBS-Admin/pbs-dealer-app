import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get('company');

    if (!company) {
      return NextResponse.json(
        { error: 'Company parameter is required' },
        { status: 400 }
      );
    }

    // Only select the columns we need
    const result = await query(
      'SELECT ID, Company, QuoteData FROM Quotes WHERE Company = ? AND Active = 1',
      [company]
    );

    // Parse QuoteData for each quote
    const parsedQuotes = result.map((quote) => ({
      ...quote,
      QuoteData: JSON.parse(quote.QuoteData),
    }));

    return NextResponse.json({ quotes: parsedQuotes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching quotes' },
      { status: 500 }
    );
  }
}
