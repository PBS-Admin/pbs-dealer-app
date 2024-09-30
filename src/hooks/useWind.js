import { useState, useCallback } from 'react';

function useWind(initialFormValues, setFormValues) {
  const [windPrompt, setWindPrompt] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [finalWindValue, setFinalWindValue] = useState(null);

  const OSSC19WindZones = {
    Baker: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [97, 103, 110, 114],
        },
      ],
      Zone2: null,
    },
    Benton: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [90, 96, 102, 107],
        },
      ],
      Zone2: null,
    },
    Clackamas: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: false,
          Wind: [92, 98, 105, 109],
        },
      ],
      Zone2: null,
    },
    Clatsop: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: '',
          Wind: [91, 96, 102, 107],
        },
      ],
      Zone2: null,
    },
    Columbia: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [91, 97, 103, 107],
        },
      ],
      Zone2: null,
    },
    Coos: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Pacific Ocean?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [89, 95, 101, 106],
        },
      ],
      Zone2: null,
    },
    Crook: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [100, 110, 115, 115],
        },
        {
          Prompt: '',
          Wind: [93, 100, 106, 111],
        },
      ],
      Zone2: null,
    },
    Curry: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: '',
          Wind: [88, 94, 101, 105],
        },
      ],
      Zone2: null,
    },
    Deschutes: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [100, 110, 115, 115],
        },
        {
          Prompt: '',
          Wind: [93, 99, 106, 110],
        },
      ],
      Zone2: null,
    },
    Douglas: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Pacific Ocean?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [91, 97, 103, 108],
        },
      ],
      Zone2: null,
    },
    Gilliam: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [94, 100, 107, 111],
        },
      ],
      Zone2: null,
    },
    Grant: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [95, 101, 108, 113],
        },
      ],
      Zone2: null,
    },
    Harney: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [94, 101, 108, 112],
        },
      ],
      Zone2: null,
    },
    'Hood River': {
      Split: 45.5,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [92, 98, 105, 109],
        },
      ],
      Zone2: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [110, 110, 115, 115],
        },
        {
          Prompt: '',
          Wind: [92, 98, 105, 109],
        },
      ],
    },
    Jackson: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [90, 96, 103, 107],
        },
      ],
      Zone2: null,
    },
    Jefferson: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [100, 110, 115, 115],
        },
        {
          Prompt: false,
          Wind: [93, 99, 106, 110],
        },
      ],
      Zone2: null,
    },
    Josephine: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [89, 95, 102, 106],
        },
      ],
      Zone2: null,
    },
    Klamath: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [100, 110, 115, 115],
        },
        {
          Prompt: false,
          Wind: [91, 98, 104, 108],
        },
      ],
      Zone2: null,
    },
    Lake: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [93, 99, 106, 111],
        },
      ],
      Zone2: null,
    },
    Lane: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Pacific Ocean?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [91, 98, 105, 110],
        },
      ],
      Zone2: null,
    },
    Lincoln: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: '',
          Wind: [90, 96, 102, 106],
        },
      ],
      Zone2: null,
    },
    Linn: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [92, 98, 104, 108],
        },
      ],
      Zone2: null,
    },
    Malheur: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [96, 102, 109, 113],
        },
      ],
      Zone2: null,
    },
    Marion: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [92, 98, 104, 108],
        },
      ],
      Zone2: null,
    },
    Morrow: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [94, 101, 108, 112],
        },
      ],
      Zone2: null,
    },
    Multnomah: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [92, 98, 105, 110],
        },
      ],
      Zone2: null,
    },
    Polk: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [90, 97, 103, 107],
        },
      ],
      Zone2: null,
    },
    Sherman: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: '',
          Wind: [93, 99, 106, 111],
        },
      ],
      Zone2: null,
    },
    Tillamook: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: '',
          Wind: [91, 96, 102, 107],
        },
      ],
      Zone2: null,
    },
    Umatilla: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [125, 135, 145, 145],
        },
        {
          Prompt: '',
          Wind: [95, 102, 109, 113],
        },
      ],
      Zone2: null,
    },
    Union: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [96, 102, 109, 113],
        },
      ],
      Zone2: null,
    },
    Wallowa: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [97, 103, 110, 115],
        },
      ],
      Zone2: null,
    },
    Wasco: {
      Split: false,
      Zone: [
        {
          Prompt: 'Is building site fully exposed to the Columbia River Gorge?',
          Wind: [115, 120, 130, 130],
        },
        {
          Prompt: 'Is building site in Special Wind Region?',
          Wind: [100, 110, 115, 115],
        },
        {
          Prompt: '',
          Wind: [93, 99, 106, 110],
        },
      ],
      Zone2: null,
    },
    Washington: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [91, 97, 103, 107],
        },
      ],
      Zone2: null,
    },
    Wheeler: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [94, 100, 107, 111],
        },
      ],
      Zone2: null,
    },
    Yamhill: {
      Split: false,
      Zone: [
        {
          Prompt: false,
          Wind: [91, 97, 103, 107],
        },
      ],
      Zone2: null,
    },
  };

  const updateWindLoadValue = useCallback(
    (windValue) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        windLoad: windValue,
        buildings: prevValues.buildings.map((building, index) =>
          index === 0 ? { ...building, windLoad: windValue } : building
        ),
      }));
    },
    [setFormValues]
  );

  const getWindLoad = useCallback(() => {
    const values = initialFormValues;
    if (values.projectState !== 'OR') {
      console.log('Not Oregon, wind load calculation not implemented');
      return null;
    }

    const newWindPrompt = [];
    const cat = ['1', '2', '3', '4'].indexOf(values.riskCategory);
    const county = values.projectCounty;

    if (values.buildingCode === 'ossc22' || values.buildingCode === 'ossc19') {
      const countyData = OSSC19WindZones[county];
      if (!countyData) {
        console.error(`No data for county: ${county}`);
        return null;
      }

      const zoneData =
        !countyData.Split || values.projectLatitude > countyData.Split
          ? countyData.Zone
          : countyData.Zone2;

      zoneData.forEach((zone) => {
        newWindPrompt.push({
          Prompt: zone.Prompt,
          Wind: zone.Wind[cat],
        });
      });

      setWindPrompt(newWindPrompt);
      setCurrentIndex(0);

      if (newWindPrompt.length > 0) {
        if (
          newWindPrompt[0].Prompt === false ||
          newWindPrompt[0].Prompt === ''
        ) {
          const immediateWindValue = newWindPrompt[0].Wind;
          setFinalWindValue(immediateWindValue);
          updateWindLoadValue(immediateWindValue);
          return immediateWindValue;
        } else {
          setIsDialogOpen(true);
          return null;
        }
      }
    }

    console.log('Building code not supported');
    return null;
  }, [initialFormValues, updateWindLoadValue]);

  const handleResponse = useCallback(
    (response) => {
      if (response) {
        // User confirmed the prompt
        const windValue = windPrompt[currentIndex].Wind;
        setFinalWindValue(windValue);
        updateWindLoadValue(windValue);
        setIsDialogOpen(false);
      } else {
        // User cancelled the prompt, move to next prompt
        const nextIndex = currentIndex + 1;
        if (nextIndex < windPrompt.length) {
          const nextPrompt = windPrompt[nextIndex];
          if (nextPrompt.Prompt === false || nextPrompt.Prompt === '') {
            // If next prompt is false or empty, use its wind value
            setFinalWindValue(nextPrompt.Wind);
            updateWindLoadValue(nextPrompt.Wind);
            setIsDialogOpen(false);
          } else {
            // Move to next prompt
            setCurrentIndex(nextIndex);
          }
        } else {
          // We've reached the end of the prompts
          setIsDialogOpen(false);
          // You might want to set a default value or handle this case differently
          console.log('Reached end of wind prompts without confirmation');
        }
      }
    },
    [currentIndex, windPrompt, updateWindLoadValue]
  );

  return {
    getWindLoad,
    currentPrompt: windPrompt[currentIndex],
    isDialogOpen,
    finalWindValue,
    handleResponse,
  };
}

export default useWind;
