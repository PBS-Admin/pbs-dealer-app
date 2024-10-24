import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { zipCode } = await req.json();

    // Validate zip code
    if (!zipCode || typeof zipCode !== 'string' || zipCode.length !== 5) {
      return NextResponse.json(
        { message: 'Invalid zip code format' },
        { status: 400 }
      );
    }

    // Query the database for the zip code data
    const result = await query(
      'SELECT FiveYear, TwentyFiveYear FROM Library_RainIntensity WHERE Zip = ?',
      [zipCode]
    );

    // Check if zip code was found
    if (!result || result.length === 0) {
      return NextResponse.json(
        { message: 'Zip code not found' },
        { status: 404 }
      );
    }

    // Return the found data
    const { FiveYear, TwentyFiveYear } = result[0];

    return NextResponse.json(
      {
        message: 'Zip code data retrieved successfully',
        data: {
          zipCode,
          fiveYear: FiveYear,
          twentyFiveYear: TwentyFiveYear,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Zip code lookup error:', error);
    return NextResponse.json(
      { message: 'An error occurred while looking up zip code' },
      { status: 500 }
    );
  }
}
