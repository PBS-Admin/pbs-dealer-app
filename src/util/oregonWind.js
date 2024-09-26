import { useState } from 'react';

function useWind(initialState) {
  const [values, setValues] = useState(initialState);

  let windPrompt = new Array();
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

  const getWindLoad = () => {
    if (values.projectState != 'OR') {
      // todo: set longitude and latitude when address is changed, then set the url here
      //   var url =
      //     'https://hazards.atcouncil.org/#/wind?lat=' +
      //     jQuery('#projectLatitude').val() +
      //     '&lng=' +
      //     jQuery('#projectLongitude').val() +
      //     '&address=' +
      //     getProjectAddressURL();
      //   openDefaultBrowser(url);
    } else {
      windPrompt = new Array();
      var cat = 1;
      cat = values.riskCategory == '1' ? 0 : cat;
      cat = values.riskCategory == '2' ? 1 : cat;
      cat = values.riskCategory == '3' ? 2 : cat;
      cat = values.riskCategory == '4' ? 3 : cat;
      var county = values.projectCounty;

      if (values.buildingCode == 'OSSC22' || values.buildingCode == 'OSSC19') {
        if (OSSC19WindZones[county]['Split'] == false) {
          for (let i = 0; i < OSSC19WindZones[county]['Zone'].length; i++) {
            windPrompt.push({
              Prompt: OSSC19WindZones[county]['Zone'][i]['Prompt'],
              Wind: OSSC19WindZones[county]['Zone'][i]['Wind'][cat],
            });
          }
        } else {
          if (
            values.projectCounty != ''
            // OSSC19WindZones[county]['Split'] < jQuery('#projectLatitude').val()
          ) {
            for (let i = 0; i < OSSC19WindZones[county]['Zone'].length; i++) {
              windPrompt.push({
                Prompt: OSSC19WindZones[county]['Zone'][i]['Prompt'],
                Wind: OSSC19WindZones[county]['Zone'][i]['Wind'][cat],
              });
            }
          } else {
            for (let i = 0; i < OSSC19WindZones[county]['Zone2'].length; i++) {
              windPrompt.push({
                Prompt: OSSC19WindZones[county]['Zone2'][i]['Prompt'],
                Wind: OSSC19WindZones[county]['Zone2'][i]['Wind'][cat],
              });
            }
          }
        }
        // promptForWind();
      }
    }
  };

  return {
    getWindLoad,
  };
}

export default useWind;
