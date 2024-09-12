import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function POST(req) {
  try {
    let result;
    const { currentQuote, company, values } = await req.json();

    console.log(currentQuote);
    console.log(company);

    if (currentQuote == 0) {
      // Store the new user in the database
      result = await query(
        'INSERT INTO Quotes (Company, QuoteData) VALUES (?, ?)',
        [company, JSON.stringify(values)]
      );

      const quoteId = result.insertId;

      return NextResponse.json({ message: `${quoteId}` }, { status: 201 });
    } else if (currentQuote > 0) {
      // Store the new user in the database
      result = await query('UPDATE Quotes SET QuoteData = ? WHERE id = ?', [
        JSON.stringify(values),
        currentQuote,
      ]);

      return NextResponse.json({ message: `Quote updated` }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
