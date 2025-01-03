import { useState, useCallback } from 'react';

const useSnow = (values, onChange) => {
  const [sLoading, setLoading] = useState(false);
  const [sError, setError] = useState(null);
  const [snowData, setSnowData] = useState(null);

  const getSnowLoad = useCallback(async () => {
    if (!values.projectLatitude || !values.projectLongitude) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/snowload?lat=${values.projectLatitude}&lon=${values.projectLongitude}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      onChange({ target: { name: 'groundSnowLoad', value: data.snowload } });
      onChange({ target: { name: 'projectElevation', value: data.elevation } });
    } catch (error) {
      setError(error.message || 'Failed to fetch snow load data');
    } finally {
      setLoading(false);
    }
  }, [values.projectLatitude, values.projectLongitude, onChange]);

  return { getSnowLoad, snowData, sLoading, sError };
};

export default useSnow;
