import { useState, useEffect, useCallback } from 'react';
import usePlaces from './usePlaces';

const useAddress = (apiKey, inputRef) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const isLoaded = usePlaces(apiKey);

  const initAutocomplete = useCallback(() => {
    if (
      !inputRef.current ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      console.log('Google Maps API not fully loaded yet');
      return;
    }

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
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
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [inputRef]);

  useEffect(() => {
    if (isLoaded && !autocomplete && inputRef.current) {
      initAutocomplete();
    }
  }, [isLoaded, autocomplete, initAutocomplete, inputRef]);

  useEffect(() => {
    const checkGoogleMapsLoaded = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMapsLoaded);
        initAutocomplete();
      }
    }, 100);

    return () => clearInterval(checkGoogleMapsLoaded);
  }, [initAutocomplete]);

  const extractAddressDetails = (place) => {
    let details = {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
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
          case 'country':
            details.country = component.long_name;
            break;
        }
      }
    }

    return details;
  };

  const resetAddressDetails = useCallback(() => {
    setAddressDetails(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  return {
    addressDetails,
    isReady,
    resetAddressDetails,
  };
};

export default useAddress;
