import { useState, useCallback } from 'react';

const useGeocoding = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGeocodingData = useCallback(async (address) => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/geocode?location=${encodeURIComponent(address)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setLocationData({
        lat: data.latLng.lat,
        lng: data.latLng.lng,
        city: data.adminArea5,
        state: data.adminArea3,
        county: data.adminArea4.replace(' County', ''),
        elevation: data.elevation,
        mileage: data.mileage,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { locationData, loading, error, fetchGeocodingData };
};

export default useGeocoding;
