import { NextResponse } from 'next/server';
import { query, transaction, getPoolStatus } from '../../../../lib/db';

export async function POST(req) {
  try {
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

    const company = user.company;
    const id = user.id;
    if (currentQuote == 0) {
      let result, quoteNum, quoteNumber;

      try {
        await transaction(async (conn) => {
          // Acquire company information
          quoteNum = await conn.query(
            'SELECT Initials, NextQuoteNum From Dealer_Company WHERE ID = ? FOR UPDATE',
            [company]
          );

          if (!quoteNum || quoteNum.length === 0) {
            throw new Error('Company information not found');
          }

          quoteNumber =
            quoteNum[0].Initials === null
              ? `${quoteNum[0].NextQuoteNum}`
              : `${quoteNum[0].Initials}${quoteNum[0].NextQuoteNum}`;

          // Update quote number
          await conn.query(
            'UPDATE Dealer_Company SET NextQuoteNum = NextQuoteNum + 1 WHERE ID = ?',
            [company]
          );

          const updatedValues = { ...values, quoteNumber: quoteNumber };

          // Insert new quote
          result = await conn.query(
            'INSERT INTO Dealer_Quotes (Quote, Customer, ProjectName, Company, QuoteData, SalesPerson, DateStarted) VALUES (?, ?, ?, ?, ?, ?, Now())',
            [
              quoteNumber,
              values.customerName,
              values.projectName,
              company,
              JSON.stringify(updatedValues),
              id,
            ]
          );

          // Log the save
          await conn.query(
            'INSERT INTO Save_Log (QuoteId, SavedBy, DateSaved) VALUES (?, ?, Now())',
            [result.insertId, id]
          );
        });

        const message = {
          quoteId: Number(result.insertId),
          quoteNum: quoteNumber,
        };

        return NextResponse.json({ message }, { status: 201 });
      } catch (error) {
        console.error('Transaction failed:', error);
        return NextResponse.json(
          {
            message: 'Failed to create new quote: ' + error.message,
          },
          { status: 500 }
        );
      }
    } else if (currentQuote > 0) {
      try {
        await transaction(async (conn) => {
          await query(
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

          await conn.query(
            'INSERT INTO Save_Log (QuoteId, SavedBy, DateSaved) VALUES (?, ?, Now())',
            [currentQuote, id]
          );
        });

        return NextResponse.json(
          { message: 'Quote updated successfully', updatedValues: values },
          { status: 200 }
        );
      } catch (error) {
        console.error('Update failed:', error);
        return NextResponse.json(
          {
            message: 'Failed to update quote: ' + error.message,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Failed to process request: ' + error.message,
      },
      { status: 500 }
    );
  }
}
