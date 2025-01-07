import { NextResponse } from 'next/server';
import { query, transaction } from '../../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  try {
    // Authentication checks
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      currentQuote,
      user,
      state,
      salesPerson,
      projectManager,
      estimator,
      checker,
      complexity,
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

          const updatedValues = { ...state, quoteNumber: quoteNumber };

          // Insert new quote
          if (session.user.estimator == 0 && session.user.permission < 3) {
            result = await conn.query(
              'INSERT INTO Dealer_Quotes (Quote, Customer, ProjectName, Company, QuoteData, SalesPerson, Complexity, DateStarted) VALUES (?, ?, ?, ?, ?, ?, 1, Now())',
              [
                quoteNumber,
                state.customerName,
                state.projectName,
                company,
                JSON.stringify(updatedValues),
                id,
              ]
            );
          } else {
            result = await conn.query(
              'INSERT INTO Dealer_Quotes (Quote, Customer, ProjectName, Company, QuoteData, DateStarted) VALUES (?, ?, ?, ?, ?, Now())',
              [
                quoteNumber,
                state.customerName,
                state.projectName,
                company,
                JSON.stringify(updatedValues),
              ]
            );
          }

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
        // console.log('complex', complexityInfo?.complexity);
        await transaction(async (conn) => {
          await query(
            'UPDATE Dealer_Quotes SET QuoteData = ?, Customer = ?, ProjectName = ?, Progress = ?, Status = ?, SalesPerson = ?, ProjectManager = ?, Estimator = ?, Checker = ?, Complexity = ? WHERE id = ?',
            [
              JSON.stringify(state),
              state.customerName,
              state.projectName,
              state.quoteProgress || 0,
              state.quoteStatus,
              salesPerson,
              projectManager,
              estimator,
              checker,
              complexity,
              currentQuote,
            ]
          );

          await conn.query(
            'INSERT INTO Save_Log (QuoteId, SavedBy, DateSaved) VALUES (?, ?, Now())',
            [currentQuote, id]
          );
        });

        revalidatePath('/tracker');
        revalidatePath(`/quote/${currentQuote}`);

        return NextResponse.json(
          { message: 'Quote updated successfully', updatedValues: state },
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
