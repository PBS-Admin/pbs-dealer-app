import { useState, useCallback } from 'react';

const useSeismic = (values) => {
  const [sLoading, setLoading] = useState(false);
  const [sError, setError] = useState(null);
  const [seismicData, setSeismicData] = useState(null);
  const [smsData, setSmsData] = useState(null);

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

  const getSmsLoad = useCallback(async () => {
    if (
      !values.seismicSs ||
      !values.seismicS1 ||
      !values.buildingCode ||
      !values.seismicSite
    )
      return;
    setLoading(true);
    setError(null);
    let Ss = values.seismicSs;
    let S1 = values.seismicS1;
    let siteClass = values.seismicSite;
    const site =
      values.buildingCode == 'ibc21' ||
      values.buildingCode == 'ibc18' ||
      values.buildingCode == 'ossc22' ||
      values.buildingCode == 'ossc19' ||
      values.buildingCode == 'cbc22' ||
      values.buildingCode == 'cbc19'
        ? 'asce7-16'
        : 'ibc-2015';

    let Fa, Fv, Sds, Sd1, Sms, Sm1;
    if (site == 'ibc-2015') {
      switch (siteClass) {
        case 'A':
          Fa = 0.8;
          Fv = 0.8;
          break;
        case 'B':
          Fa = 1;
          Fv = 1;
          break;
        case 'C':
          if (Ss <= 0.5) {
            Fa = 1.2;
          } else if (Ss <= 1) {
            Fa = Ss * -0.4 + 1.4;
          } else {
            Fa = 1;
          }
          if (S1 <= 0.1) {
            Fv = 1.7;
          } else if (S1 <= 0.5) {
            Fv = S1 * -1 + 1.8;
          } else {
            Fv = 1.3;
          }
          break;
        case 'D':
          if (Ss <= 0.25) {
            Fa = 1.6;
          } else if (Ss <= 0.75) {
            Fa = Ss * -0.8 + 1.8;
          } else if (Ss <= 1.25) {
            Fa = Ss * -0.4 + 1.5;
          } else {
            Fa = 1;
          }
          if (S1 <= 0.1) {
            Fv = 2.4;
          } else if (S1 <= 0.2) {
            Fv = S1 * -4 + 2.8;
          } else if (S1 <= 0.4) {
            Fv = S1 * -2 + 2.4;
          } else if (S1 <= 0.5) {
            Fv = S1 * -1 + 2;
          } else {
            Fv = 1.5;
          }
          break;
        case 'E':
          if (Ss <= 0.25) {
            Fa = 2.5;
          } else if (Ss <= 0.5) {
            Fa = Ss * -3.2 + 3.3;
          } else if (Ss <= 0.75) {
            Fa = Ss * -2 + 2.7;
          } else if (Ss <= 1) {
            Fa = Ss * -1.2 + 2.1;
          } else {
            Fa = 0.9;
          }
          if (S1 <= 0.1) {
            Fv = 3.5;
          } else if (S1 <= 0.2) {
            Fv = S1 * -3 + 3.8;
          } else if (S1 <= 0.4) {
            Fv = S1 * -4 + 4;
          } else {
            Fv = 2.4;
          }
          break;
      }
    } else if (site == 'asce7-16') {
      switch (siteClass) {
        case 'A':
          Fa = 0.8;
          Fv = 0.8;
          break;
        case 'B':
          Fa = 0.9;
          Fv = 0.8;
          break;
        case 'C':
          if (Ss <= 0.5) {
            Fa = 1.3;
          } else if (Ss <= 0.75) {
            Fa = Ss * -0.4 + 1.5;
          } else {
            Fa = 1.2;
          }
          if (S1 <= 0.5) {
            Fv = 1.5;
          } else if (S1 <= 0.6) {
            Fv = S1 * -1 + 2;
          } else {
            Fv = 1.4;
          }
          break;
        case 'D':
          if (Ss <= 0.25) {
            Fa = 1.6;
          } else if (Ss <= 0.75) {
            Fa = Ss * -0.8 + 1.8;
          } else if (Ss <= 1.25) {
            Fa = Ss * -0.4 + 1.5;
          } else {
            Fa = 1;
          }
          if (S1 <= 0.1) {
            Fv = 2.4;
          } else if (S1 <= 0.3) {
            Fv = S1 * -2 + 2.6;
          } else if (S1 <= 0.6) {
            Fv = S1 * -1 + 2.3;
          } else {
            Fv = 1.7;
          }
          break;
        case 'E':
          if (Ss <= 0.25) {
            Fa = 2.4;
          } else if (Ss <= 0.5) {
            Fa = Ss * -2.8 + 3.1;
          } else if (Ss <= 0.75) {
            Fa = Ss * -1.6 + 2.5;
          } else {
            Fa = '';
          }
          if (S1 <= 0.1) {
            Fv = 4.2;
          } else {
            Fv = '';
          }
          break;
      }
    }

    Fa = siteClass == 'D' && Fa < 1.2 ? 1.2 : Fa;
    Sds = Fa != '' ? (2 / 3) * Fa * Ss : '';
    Sd1 = Fv != '' ? (2 / 3) * Fv * S1 : '';

    Sms = Math.round(parseFloat(Ss * Fa) * 1000) / 1000;
    Sm1 = Math.round(parseFloat(S1 * Fv) * 1000) / 1000;
    const data = {
      Fa,
      Fv,
      Sds,
      Sd1,
      Sms,
      Sm1,
    };
    setSmsData(data);
  }, [values.seismicSs, values.seismicS1]);

  return { getSeismicLoad, seismicData, getSmsLoad, smsData, sLoading, sError };
};

export default useSeismic;
