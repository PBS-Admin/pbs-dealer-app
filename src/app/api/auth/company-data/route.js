import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  try {
    // Authentication checks
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get company ID from query params
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('company');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check database connection
    const status = await getPoolStatus();
    console.log('Pool status:', status);

    // Run all queries in parallel
    const [companyData, rsms, projectManagers] = await Promise.all([
      // Company data query
      query(
        'SELECT ID, Name, Terms, Initials, Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8 FROM Dealer_Company WHERE ID = ?',
        [companyId]
      ),

      // RSMs query (Permission < 3)
      query(
        'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Permission < 3 ORDER BY FullName'
      ),

      // Project Managers query (Permission = 3)
      query(
        'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Permission = 3 ORDER BY FullName'
      ),
    ]);

    // Check if company exists
    if (!companyData.length) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Format RSMs and PMs as key-value pairs
    const formattedRsms = rsms.reduce((acc, user) => {
      acc[user.ID] = { name: user.FullName, company: user.Company };
      return acc;
    }, {});

    const formattedPMs = projectManagers.reduce((acc, user) => {
      acc[user.ID] = { name: user.FullName, company: user.Company };
      return acc;
    }, {});

    // Construct response
    const response = {
      company: companyData[0],
      rsms: formattedRsms,
      projectManagers: formattedPMs,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching company data' },
      { status: 500 }
    );
  }
}
