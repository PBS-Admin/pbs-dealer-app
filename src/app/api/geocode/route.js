import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const loc = searchParams.get('location');

    if (!loc) {
      return NextResponse.json(
        { message: 'Location is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=wBcOobwGxbJwS3RjQ3L1LH0y7KH4kNJa&outFormat=json&location=${loc}`
    );

    if (!response.ok) {
      throw new Error('Geocode response was not ok');
    }

    const data = await response.json();
    const geocodeData = data.results[0].locations[0];
    let location = `${geocodeData.latLng.lat},${geocodeData.latLng.lng}`;

    let combinedData = {
      ...geocodeData,
      elevation: 100, // Default elevation
    };

    try {
      // Elevation API call
      const elevationResponse = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${location}`,
        {
          method: 'GET',
        }
      );
      if (elevationResponse.ok) {
        const elevationData = await elevationResponse.json();
        combinedData.elevation =
          elevationData.results[0].elevation || combinedData.elevation;
      } else {
        console.warn('Elevation API request failed, using default elevation');
      }
    } catch (elevationError) {
      console.error('Error fetching elevation data:', elevationError);
    }

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error('Geocode error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch geocode data' },
      { status: 500 }
    );
  }
}
