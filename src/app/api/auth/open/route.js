import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    // ! Quote Permissions
    if (session.user.permission > 4) {
      // Admin Permissions, Dealer PM, PM
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, ProjectManager,  Estimator, DateStarted 
        FROM Dealer_Quotes 
        WHERE Status & 1`; // Started
    } else if (session.user.permission > 1 && session.user.estimator == 0) {
      // RSM 2, Supervisor
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Status & 1`; // Started
      queryParams = [company];
    } else if (session.user.permission > 1 && session.user.estimator == 1) {
      // Estimator 2, Estimating Manager
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Status & 84`; // 01010100 - check ClientQuote for status def
    } else if (session.user.estimator == 1) {
      // Estimator 1
      quotesQuery = `
        SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Estimator = ? AND Status & 84 `; // 01010100 - check ClientQuote for status def
      queryParams = [company, session.user.id];
    } else {
      // RSM 1
      quotesQuery = `
      SELECT ID, Progress, Quote, Rev, Complexity, Customer, ProjectName, 
             SalesPerson, DateStarted 
      FROM Dealer_Quotes 
      WHERE Company = ? AND Status & 1 AND SalesPerson = ?`;
      queryParams = [company, session.user.id];
    }

    const rsmQuery =
      'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Permission < 3 ORDER BY FullName';

    const companyQuery = `
      SELECT ID, Name 
      FROM Dealer_Company`;

    // Execute all queries in parallel
    const [quotesResult, rsmResult, companyResult] = await Promise.all([
      query(quotesQuery, queryParams),
      query(rsmQuery),
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

    // const parsedRsms = rsmResult.map(({ ID, FullName }) => ({
    //   ID,
    //   Name: FullName,
    // }));

    const formattedRsms = rsmResult.reduce((acc, user) => {
      acc[user.ID] = { name: user.FullName, company: user.Company };
      return acc;
    }, {});

    const parsedCompanies = companyResult.map(({ ID, Name }) => ({
      ID,
      Name,
    }));

    return NextResponse.json(
      {
        quotes: parsedQuotes,
        companies: parsedCompanies,
        rsms: formattedRsms,
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
