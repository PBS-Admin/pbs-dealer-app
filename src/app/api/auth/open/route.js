import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../lib/db';
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
      // console.log('decode: ', decodedToken);
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

    if (decodedToken.company !== parseInt(company)) {
      console.log('Company mismatch, returning 403');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only select the columns we need
    const result = await query(
      // 'SELECT ID, Submitted, Quote, Rev, Complexity, Customer, ProjectName, DateStarted FROM Dealer_Quotes WHERE Company = ? AND Active = 1',
      'SELECT q.ID as ID, q.Submitted asSubmitted, c.Initials as Prefix, q.Quote as Quote, q.Rev as Rev, q.Complexity as Complexity, q.Customer as Customer, q.ProjectName as ProjectName, q.DateStarted as DateStarted FROM Dealer_Quotes q LEFT JOIN Dealer_Company c ON q.Company = c.ID WHERE q.Company = ? AND q.Active = 1',
      [company]
    );

    // Parse QuoteData for each quote
    const parsedQuotes = result.map((quote) => ({
      ...quote,
      ID: quote.ID,
      Submitted: quote.Submitted,
      Prefix: quote.Prefix != null ? quote.Prefix : '',
      Quote: quote.Quote,
      Rev: quote.Rev,
      Complexity: quote.Complexity,
      Customer: quote.Customer,
      ProjectName: quote.ProjectName,
      DateStarted: quote.DateStarted,
    }));

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
      { quotes: parsedQuotes, companies: parsedCompanies },
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
