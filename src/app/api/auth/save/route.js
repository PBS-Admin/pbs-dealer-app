import { NextResponse } from 'next/server';
import { query, transaction, getPoolStatus } from '../../../../lib/db';

export async function POST(req) {
  try {
    let result, quoteNum, quoteNumber, nextQuoteNum;
    const {
      currentQuote,
      user,
      values,
      progress,
      salesPerson,
      projectManager,
      estimator,
      checker,
    } = await req.json();
    if (currentQuote == 0) {
      await transaction(async (conn) => {
        quoteNum = await conn.query(
          'SELECT Initials, NextQuoteNum From Dealer_Company WHERE ID = ?',
          [user.company]
        );

        quoteNumber =
          quoteNum[0].Initials === null
            ? `${quoteNum[0].NextQuoteNum}`
            : `${quoteNum[0].Initials}${quoteNum[0].NextQuoteNum}`;
        nextQuoteNum = quoteNum[0].NextQuoteNum;

        await conn.query(
          'UPDATE Dealer_Company SET NextQuoteNum = NextQuoteNum + 1 WHERE ID = ?',
          [user.company]
        );

        const updatedValues = { ...values, quoteNumber: quoteNumber };

        result = await conn.query(
          'INSERT INTO Dealer_Quotes (Quote, Customer, ProjectName, Company, QuoteData, SalesPerson, DateStarted) VALUES (?, ?, ?, ?, ?, ?, Now())',
          [
            quoteNumber,
            values.customerName,
            values.projectName,
            user.company,
            JSON.stringify(updatedValues),
            user.id,
          ]
        );

        await conn.query(
          'INSERT INTO Save_Log (QuoteId, SavedBy, DateSaved) VALUES (?, ?, Now())',
          [result.insertId, user.id]
        );
      });

      const quoteId = Number(result.insertId);
      const message = {
        quoteId: quoteId,
        quoteNum: quoteNumber,
      };

      const status = await getPoolStatus();

      return NextResponse.json({ message }, { status: 201 });
    } else if (currentQuote > 0) {
      await transaction(async (conn) => {
        result = await query(
          'UPDATE Dealer_Quotes SET QuoteData = ?, Customer = ?, ProjectName = ?, Progress = Progress ^ ?, SalesPerson = ?, ProjectManager = ?, Estimator = ?, Checker = ? WHERE id = ?',
          [
            JSON.stringify(values),
            values.customerName,
            values.projectName,
            progress || 0,
            salesPerson,
            projectManager,
            estimator,
            checker,
            currentQuote,
          ]
        );

        const logRes = await conn.query(
          'INSERT INTO Save_Log (QuoteId, SavedBy, DateSaved) VALUES (?, ?, Now())',
          [currentQuote, user.id]
        );

        console.log('logRes: ', logRes);
      });
      return NextResponse.json(
        { message: `Quote updated`, updatedValues: values },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
