import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    // Get the company from the query parameters
    const { searchParams } = new URL(req.url);
    const company = searchParams.get('company');

    if (!company) {
      return NextResponse.json(
        { message: 'Company parameter is required' },
        { status: 400 }
      );
    }

    // Retrieve quotes for the specified company
    const result = await query('SELECT * FROM Quotes WHERE Company = ?', [
      company,
    ]);

    // Return the quotes as JSON
    return NextResponse.json({ quotes: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
