import { NextResponse } from 'next/server';
import { transaction } from '../../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log('No valid session or token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = session.user.company;
    if (!company) {
      console.log('Company not found, returning 400');
      return NextResponse.json(
        { error: 'Company is required' },
        { status: 400 }
      );
    }

    let quotesQuery;
    let queryParams = [];

    // ! Quote Permissions
    if (session.user.permission > 4) {
      // Admin Permissions, Dealer PM, PM
      quotesQuery = `
        SELECT ID, Progress, Status, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, ProjectManager, Estimator, Checker, DateStarted 
        FROM Dealer_Quotes 
        WHERE Status & 1`; // Started
    } else if (session.user.permission > 1 && session.user.estimator == 0) {
      // RSM 2, Supervisor
      quotesQuery = `
        SELECT ID, Progress, Status, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, ProjectManager, Estimator, Checker, DateStarted 
        FROM Dealer_Quotes 
        WHERE Company = ? AND Status & 1`; // Started
      queryParams = [company];
    } else if (session.user.permission > 1 && session.user.estimator == 1) {
      // Estimator 2, Estimating Manager
      quotesQuery = `
        SELECT ID, Progress, Status, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, ProjectManager, Estimator, Checker, DateStarted 
        FROM Dealer_Quotes 
        WHERE Status & 85`; // 01010101 - check QuoteClient for status def
    } else if (session.user.estimator == 1) {
      // Estimator 1
      quotesQuery = `
        SELECT ID, Progress, Status, Quote, Rev, Complexity, Customer, ProjectName, 
               SalesPerson, ProjectManager, Estimator, Checker, DateStarted 
        FROM Dealer_Quotes 
        WHERE Estimator = ? AND Status & 84 `; // 01010100 - check QuoteClient for status def
      queryParams = [company, session.user.id];
    } else {
      // RSM 1
      quotesQuery = `
      SELECT ID, Progress, Status, Quote, Rev, Complexity, Customer, ProjectName, 
             SalesPerson, ProjectManager, Estimator, Checker, DateStarted 
      FROM Dealer_Quotes 
      WHERE Company = ? AND Status & 1 AND SalesPerson = ?`;
      queryParams = [company, session.user.id];
    }

    // Execute all queries in parallel usign transaction
    const quotesResult = await transaction(async (conn) => {
      const result = await conn.query(quotesQuery, queryParams);
      return result;
    });

    // Transform results
    const parsedQuotes = quotesResult.map(
      ({
        ID,
        Progress,
        Status,
        Quote,
        Rev,
        Complexity,
        Customer,
        SalesPerson,
        ProjectManager,
        Estimator,
        Checker,
        ProjectName,
        DateStarted,
      }) => ({
        ID,
        Progress,
        Status,
        Quote,
        Rev,
        Complexity,
        Customer,
        SalesPerson,
        ProjectManager,
        Estimator,
        Checker,
        ProjectName,
        DateStarted,
      })
    );

    return NextResponse.json(
      {
        quotes: parsedQuotes,
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
