import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '../../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No bearer token found, returning Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      console.log('Missing parameters, returning 400');
      return NextResponse.json(
        { error: 'Company and ID parameters are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM Dealer_Quotes WHERE ID = ? AND Active = 1',
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
