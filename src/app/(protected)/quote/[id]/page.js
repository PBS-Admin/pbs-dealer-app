export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import QuoteClient from '../QuoteClient';
import { query } from '../../../../lib/db';
import { BuildingProvider } from '@/contexts/BuildingContext';
import { initialState as emptyInitialState } from '@/lib/initialState';

export default async function Quote({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const quoteId = params.id;
  let initialQuoteData = null;
  let error = null;

  // If quoteId is 0, start a new quote with initial data
  if (quoteId == 0) {
    initialQuoteData = {
      ...emptyInitialState,
      salesPerson: session.user.id,
      companyId: session.user.company,
    };
  } else if (quoteId != null) {
    try {
      let quotesQuery = 'SELECT * FROM Dealer_Quotes WHERE id = ?';
      let queryParams = [quoteId];

      // Restrict by company for lower permission levels
      if (session.user.permission < 5 && session.user.estimator != 1) {
        quotesQuery += ' AND Company = ?';
        queryParams.push(session.user.company);
      }

      const quotesResult = await query(quotesQuery, queryParams);

      if (quotesResult.length > 0) {
        const quoteData = quotesResult[0];

        let companyName = '';
        if (quoteData.Company !== session.user.company) {
          const companyResult = await query(
            'SELECT Name FROM Dealer_Company WHERE ID = ?',
            [quoteData.Company]
          );
          if (companyResult.length > 0) {
            companyName = companyResult[0].Name;
          }
        }

        const parsedQuoteData = JSON.parse(quoteData.QuoteData);

        // Add assignments to quote data
        initialQuoteData = {
          ...emptyInitialState,
          ...parsedQuoteData,
          quoteId: quoteId,
          quoteProgress: quoteData.Progress,
          quoteStatus: quoteData.Status,
          salesPerson: quoteData.SalesPerson || '',
          projectManager: quoteData.ProjectManager || '',
          estimator: quoteData.Estimator || '',
          checker: quoteData.Checker || '',
          companyId: quoteData.Company,
          companyName: companyName || undefined,
        };
      } else {
        error = 'Quote not found';
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      error = `Error fetching quote: ${err.message}`;
    }
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BuildingProvider
      initialState={initialQuoteData}
      key={`quote-${quoteId}-${Date.now()}`}
    >
      <QuoteClient />
    </BuildingProvider>
  );
}
