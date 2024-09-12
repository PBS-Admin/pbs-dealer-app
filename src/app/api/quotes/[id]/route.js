import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(req, { params }) {
  const { id } = params;

  console.log('Received delete request for quote ID:', id);

  try {
    const result = await query('UPDATE Quotes SET Active = 0 WHERE ID = ?', [
      id,
    ]);
    console.log('Query result:', result);

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
