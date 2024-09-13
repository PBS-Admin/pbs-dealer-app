import { NextResponse } from 'next/server';
import { query, transaction, manualCleanup } from '../../../../lib/db';

export async function POST(req) {
  try {
    let result, quoteNum;
    const { currentQuote, company, values } = await req.json();

    if (currentQuote == 0) {
      await transaction(async (conn) => {
        quoteNum = await conn.query('SELECT NextQuoteNum From NextQuoteNumber');

        result = await conn.query(
          'INSERT INTO Quotes (Quote, Customer, ProjectName, Company, QuoteData, Active, DateStarted) VALUES (?, ?, ?, ?, ?, 1, Now())',
          [
            quoteNum[0].NextQuoteNum,
            values.customerName,
            values.projectName,
            company,
            JSON.stringify(values),
          ]
        );
      });
      const quoteId = result.insertId;

      if (process.env.NODE_ENV === 'development') {
        await manualCleanup();
      }

      return NextResponse.json({ message: `${quoteId}` }, { status: 201 });
    } else if (currentQuote > 0) {
      // Store the new user in the database
      result = await query(
        'UPDATE Quotes SET QuoteData = ?, Customer = ?, ProjectName = ? WHERE id = ?',
        [
          JSON.stringify(values),
          values.customerName,
          values.projectName,
          currentQuote,
        ]
      );

      return NextResponse.json({ message: `Quote updated` }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
