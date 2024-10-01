import { useState, useCallback } from 'react';

const useSeismic = (values) => {
  const [sLoading, setLoading] = useState(false);
  const [sError, setError] = useState(null);
  const [seismicData, setSeismicData] = useState(null);

  const getSeismicLoad = useCallback(async () => {
    if (
      !values.projectLatitude ||
      !values.projectLongitude ||
      !values.buildingCode ||
      !values.riskCategory ||
      !values.seismicSite
    )
      return;

    setLoading(true);
    setError(null);

    const site =
      values.buildingCode == 'ibc21' ||
      values.buildingCode == 'ibc18' ||
      values.buildingCode == 'ossc22' ||
      values.buildingCode == 'ossc19' ||
      values.buildingCode == 'cbc22' ||
      values.buildingCode == 'cbc19'
        ? 'asce7-16'
        : 'ibc-2015';

    try {
      const response = await fetch(
        `/api/seismic?site=${site}&lat=${values.projectLatitude}&lon=${values.projectLongitude}&risk=${values.riskCategory}&siteClass=${values.seismicSite}`
      );

      if (!response.ok) {
        throw new Error('Seismic response was not ok');
      }

      const data = await response.json();

      setSeismicData(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch seismic load data');
    } finally {
      setLoading(false);
    }
  }, [values.projectLatitude, values.projectLongitude]);

  return { getSeismicLoad, seismicData, sLoading, sError };
};

export default useSeismic;
