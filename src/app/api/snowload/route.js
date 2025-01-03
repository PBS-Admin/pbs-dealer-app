import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { message: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://snowload.seao.org/lookup.phtml?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error('Snow load service response was not ok');
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Snow load error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch snow load data' },
      { status: 500 }
    );
  }
}
