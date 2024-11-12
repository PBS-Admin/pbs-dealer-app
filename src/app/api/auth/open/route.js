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

    if (!session || !token) {
      console.log('No valid session or token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const currentCompany = session.user.company;
    console.log('Session company:', currentCompany);
    console.log('Request company:', parseInt(company));

    if (currentCompany != parseInt(company)) {
      console.log('Company mismatch, returning 403');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only select the columns we need
    const result = await query(
      'SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, DateStarted FROM Dealer_Quotes WHERE Company = ? AND Status & 1',
      [company]
    );

    // Parse QuoteData for each quote
    const parsedQuotes = result.map((quote) => ({
      ...quote,
      ID: quote.ID,
      Progress: quote.Progress,
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
