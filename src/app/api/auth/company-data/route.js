import { NextResponse } from 'next/server';
import { transaction } from '../../../../lib/db';
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

    // Use a single transaction for all queries
    const result = await transaction(async (conn) => {
      // Run all queries in parallel within the transaction
      const [companyData, rsms, projectManagers, estimators] =
        await Promise.all([
          // Company data query
          conn.query(
            'SELECT ID, Name, Terms, Initials, Line1, Line2, Line3, Line4, Line5, Line6, Line7, Line8 FROM Dealer_Company WHERE ID = ?',
            [companyId]
          ),

          // RSMs query (Permission < 3)
          conn.query(
            'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Permission < 4 ORDER BY FullName'
          ),

          // Project Managers query (Permission = 3)
          conn.query(
            'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Permission < 6 AND Permission > 3 ORDER BY FullName'
          ),

          // Estimators query (Estimator = 1)
          conn.query(
            'SELECT ID, Username, FullName, Company FROM Dealer_Users WHERE ACTIVE = 1 AND Estimator = 1 ORDER BY FullName'
          ),
        ]);

      // Check if company exists
      if (!companyData.length) {
        throw new Error('Company not found');
      }

      // Format users as key-value pairs
      const formattedRsms = rsms.reduce((acc, user) => {
        acc[user.ID] = { name: user.FullName, company: user.Company };
        return acc;
      }, {});

      const formattedPMs = projectManagers.reduce((acc, user) => {
        acc[user.ID] = { name: user.FullName, company: user.Company };
        return acc;
      }, {});

      const formattedEstimators = estimators.reduce((acc, user) => {
        acc[user.ID] = { name: user.FullName, company: user.Company };
        return acc;
      }, {});

      return {
        company: companyData[0],
        rsms: formattedRsms,
        projectManagers: formattedPMs,
        estimators: formattedEstimators,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    if (error.message === 'Company not found') {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'An error occurred while fetching company data' },
      { status: 500 }
    );
  }
}
