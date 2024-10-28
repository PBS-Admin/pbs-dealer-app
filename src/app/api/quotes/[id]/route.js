import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { query, getPoolStatus } from '@/lib/db';

export async function DELETE(req, { params }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Received delete request for quote ID:', id);

  try {
    const result = await query(
      'UPDATE Dealer_Quotes SET Active = 0 WHERE ID = ?',
      [id]
    );

    const status = await getPoolStatus();

    return NextResponse.json(
      { message: 'Quote deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the quote' },
      { status: 500 }
    );
  }
}
