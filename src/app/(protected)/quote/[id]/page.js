import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ClientQuote from '../ClientQuote';
import { query } from '../../../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Quote({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const quoteId = params.id;
  let quoteData = null;
  let progress = null;
  let status = null;
  let error = null;
  let rsms = null;
  let salesPerson = null;
  let projectManager = null;
  let estimator = null;
  let checker = null;

  if (quoteId != 0 && quoteId != null) {
    try {
      let quoteQuery;
      let quoteParams = [];
      (quoteQuery = 'SELECT * FROM Dealer_Quotes WHERE id = ? AND Company = ?'),
        (quoteParams = [quoteId, session.user.company]);

      let rsmQuery;
      let rsmParams = [];
      if (session.user.permission < 3) {
        rsmQuery = `
        SELECT ID as id, FullName as label
        FROM Dealer_Users 
        WHERE Active = 1 AND Company = ?`;
        rsmParams = [session.user.company];
      } else {
        rsmQuery = `
        SELECT ID as id, FullName as label 
        FROM Dealer_Users 
        WHERE Active = 1`;
      }

      const [quotesResult, rsmResult] = await Promise.all([
        query(quoteQuery, quoteParams),
        query(rsmQuery, rsmParams),
      ]);

      if (quotesResult.length > 0) {
        quoteData = quotesResult[0].QuoteData;
        progress = quotesResult[0].Progress;
        status = quotesResult[0].Status;
        salesPerson = quotesResult[0].SalesPerson;
        projectManager = quotesResult[0].ProjectManager;
        estimator = quotesResult[0].Estimator;
        checker = quotesResult[0].Checker;
      } else {
        error = 'Quote not found';
      }
      if (quotesResult.length > 0) {
        rsms = rsmResult;
      } else {
        error = 'Rsms not found';
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
    <ClientQuote
      session={session}
      quoteId={quoteId}
      initialQuoteData={JSON.parse(quoteData)}
      progress={progress}
      status={status}
      rsms={rsms}
      salesPerson={salesPerson}
      projectManager={projectManager}
      estimator={estimator}
      checker={checker}
    />
  );
}
