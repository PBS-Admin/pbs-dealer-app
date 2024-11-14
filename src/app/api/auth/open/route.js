import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
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
    if (currentCompany != parseInt(company)) {
      console.log('Company mismatch, returning 403');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let quotesQuery;
    let queryParams = [];

    if (session.user.permission > 6) {
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Status & 1`;
    } else if (session.user.permission > 1) {
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Status & 1`;
      queryParams = [company];
    } else if (session.user.estimator == 0) {
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Status & 1 AND SalesPerson = ?`;
      queryParams = [company, session.user.id];
    } else {
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Status & 1 AND Estimator = ?`;
      queryParams = [company, session.user.id];
    }

    let rsmQuery;
    let rsmParams = [];
    if (session.user.permission < 3) {
      rsmQuery = `
      SELECT ID, FullName 
      FROM Dealer_Users 
      WHERE Active = 1 AND Company = ?`;
      rsmParams = [company];
    } else {
      rsmQuery = `
      SELECT ID, FullName 
      FROM Dealer_Users 
      WHERE Active = 1`;
    }

    const companyQuery = `
      SELECT ID, Name 
      FROM Dealer_Company`;

    // Execute all queries in parallel
    const [quotesResult, rsmResult, companyResult] = await Promise.all([
      query(quotesQuery, queryParams),
      query(rsmQuery, rsmParams),
      query(companyQuery),
    ]);

    // Transform results
    const parsedQuotes = quotesResult.map(
      ({
        ID,
        Progress,
        Quote,
        Rev,
        Complexity,
        Customer,
        SalesPerson,
        ProjectName,
        DateStarted,
      }) => ({
        ID,
        Progress,
        Quote,
        Rev,
        Complexity,
        Customer,
        SalesPerson,
        ProjectName,
        DateStarted,
      })
    );

    const parsedRsms = rsmResult.map(({ ID, FullName }) => ({
      ID,
      Name: FullName,
    }));

    const parsedCompanies = companyResult.map(({ ID, Name }) => ({
      ID,
      Name,
    }));

    return NextResponse.json(
      {
        quotes: parsedQuotes,
        companies: parsedCompanies,
        rsms: parsedRsms,
      },
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
