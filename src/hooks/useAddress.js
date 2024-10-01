import { useState, useEffect, useCallback } from 'react';
import usePlaces from './usePlaces';

const useAddress = (apiKey) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);
  const isLoaded = usePlaces(apiKey);

  useEffect(() => {
    if (isLoaded && !autocomplete) {
      initAutocomplete();
    }
  }, [isLoaded]);

  const initAutocomplete = useCallback(() => {
    const input = document.getElementById('projectAddress');
    if (!input) {
      console.error("Element with id 'projectAddress' not found");
      return;
    }

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        input,
        { types: ['address'] }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (!place.geometry) {
          console.error('Returned place contains no geometry');
          return;
        }
        const details = extractAddressDetails(place);
        setAddressDetails(details);
      });

      setAutocomplete(autocompleteInstance);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, []);

  const extractAddressDetails = (place) => {
    let details = {
      street: '',
      city: '',
      state: '',
      zip: '',
    };

    if (place.address_components) {
      for (let component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case 'street_number':
            details.street = `${component.long_name} ${details.street}`;
            break;
          case 'route':
            details.street += component.short_name;
            break;
          case 'locality':
            details.city = component.long_name;
            break;
          case 'administrative_area_level_1':
            details.state = component.short_name;
            break;
          case 'postal_code':
            details.zip = component.long_name;
            break;
        }
      }
    }

    return details;
  };

  const resetAddressDetails = useCallback(() => {
    setAddressDetails(null);
  }, []);

  return { addressDetails, isLoaded, resetAddressDetails };
};

export default useAddress;
