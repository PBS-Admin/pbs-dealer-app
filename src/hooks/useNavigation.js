import { useState, useEffect } from 'react';

const useNavigation = (activeBuilding, initialIndex = 0) => {
  const navItems = [
    {
      id: 'quote-info',
      label: 'Project Information',
    },
    // { id: 'design-code', label: 'Design Codes' },
    {
      id: 'building-project',
      label: 'Building Project',
    },
    {
      id: 'bldg-layout',
      label:
        'Building ' + String.fromCharCode(activeBuilding + 65) + ' - Layout',
    },
    {
      id: 'bldg-extensions',
      label:
        'Building ' +
        String.fromCharCode(activeBuilding + 65) +
        ' - Extensions',
    },
    {
      id: 'bldg-partitions',
      label:
        'Building ' +
        String.fromCharCode(activeBuilding + 65) +
        ' - Partitions',
    },
    {
      id: 'bldg-options',
      label:
        'Building ' + String.fromCharCode(activeBuilding + 65) + ' - Options',
    },
    // {
    //   id: 'bldg-cranes',
    //   label: 'Building ' + String.fromCharCode(activeBuilding + 65) + ' - Cranes',
    // },
    {
      id: 'bldg-openings',
      label:
        'Building ' + String.fromCharCode(activeBuilding + 65) + ' - Openings',
    },
    { id: 'accessories', label: 'Accessories' },
    {
      id: 'finalize-quote',
      label: 'Finalize Quote',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeCard, setActiveCard] = useState(navItems[initialIndex].id);

  useEffect(() => {
    setActiveCard(navItems[currentIndex].id);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : navItems.length - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex < navItems.length - 1 ? prevIndex + 1 : 0;
      return newIndex;
    });
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const setActiveCardDirectly = (cardId) => {
    const index = navItems.findIndex((item) => item.id === cardId);
    if (index !== -1) {
      setCurrentIndex(index);
      setActiveCard(cardId);
    }
  };

  return {
    navItems,
    currentIndex,
    activeCard,
    handlePrev,
    handleNext,
    handleDotClick,
    setActiveCardDirectly,
  };
};

export default useNavigation;
