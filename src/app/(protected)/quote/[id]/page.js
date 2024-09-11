import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ClientQuote from '../ClientQuote';
import { query } from '../../../../lib/db';

export default async function Quote({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const quoteId = params.id;
  let quoteData = null;
  let error = null;

  try {
    const results = await query(
      'SELECT * FROM Quotes WHERE id = ? AND Company = ?',
      [quoteId, session.user.company]
    );

    if (results.length > 0) {
      quoteData = results[0].QuoteData;
    } else {
      error = 'Quote not found';
    }
  } catch (err) {
    console.error('Error fetching quote:', err);
    error = `Error fetching quote: ${err.message}`;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ClientQuote
      session={session}
      quoteId={quoteId}
      initialQuoteData={JSON.parse(quoteData)}
    />
  );
}
