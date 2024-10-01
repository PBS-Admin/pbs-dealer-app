import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const site = searchParams.get('site');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const risk = searchParams.get('risk');
    const siteClass = searchParams.get('siteClass');

    if (!site || !lat || !lon || !risk || !siteClass) {
      return NextResponse.json(
        { message: 'Site, latitude, longitude and risk are all required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://earthquake.usgs.gov/ws/designmaps/${site}.json?latitude=${lat}&longitude=${lon}&variant=0&siteClass=${siteClass}&title=Example&riskCategory=${risk}`
    );

    if (!response.ok) {
      throw new Error('Snow load service response was not ok');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Snow load error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch seismic load data' },
      { status: 500 }
    );
  }
}
