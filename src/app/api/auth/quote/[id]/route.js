import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session || !token) {
      console.log('No valid session or token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    console.log('search: ', searchParams);
    const id = params.id;

    if (!id) {
      console.log('Missing parameters, returning 400');
      return NextResponse.json(
        { error: 'Company and ID parameters are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM Dealer_Quotes WHERE ID = ? AND Status = 1',
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const quote = result[0];
    // const quote = {
    //   ...result[0],
    //   ID: result[0].ID,
    //   Submitted: result[0].Submitted,
    //   Quote: result[0].Quote,
    //   Rev: result[0].Rev,
    //   Customer: result[0].Customer,
    //   ProjectName: result[0].ProjectName,
    //   DateStarted: result[0].DateStarted,
    // };

    const status = await getPoolStatus();
    console.log('Pool status:', status);

    return NextResponse.json({ quote }, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the quote' },
      { status: 500 }
    );
  }
}
