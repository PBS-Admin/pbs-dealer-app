import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useFlatThreeSetup } from '../hooks/useFlatThreeSetup';
import {
  createBuilding,
  addBayLines,
  addBraceLines,
  addExtensions,
  addOpenings,
  calculateHeightAtPosition,
  addPartition,
  addPartitions,
} from './BuildingUtils';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

const BuildingFlatSketch = ({ activeWall = 'front', activePartition }) => {
  const backgroundColor = 0xf5f5f5;
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const { state } = useBuildingContext();
  const { activeBuilding } = useUIContext();

  const { scene, camera, renderer, controls, isSetup } = useFlatThreeSetup(
    mountRef,
    backgroundColor,
    {
      width: state.buildings[activeBuilding].width,
      length: state.buildings[activeBuilding].length,
      height: state.buildings[activeBuilding].backEaveHeight,
      backPeakOffset: state.buildings[activeBuilding].backPeakOffset,
      partitions: state.buildings[activeBuilding].partitions,
    },
    activeWall
  );

  const updateBuilding = useCallback(
    (activeWall) => {
      if (!isSetup || !scene) return;

      // Remove all existing building objects
      scene.children = scene.children.filter(
        (child) =>
          ![
            'building',
            'roof',
            'buildingLines',
            'roofLines',
            'bayLines',
            'axesHelper',
            'braceLines',
            'extensionLines',
            'extensions',
            'openings',
            'partition',
            'partitionLines',
            'partitionBG',
          ].includes(child.name)
      );
      // Add an axes helper
      const axesHelper = new THREE.AxesHelper(100);
      axesHelper.name = 'axesHelper';
      // scene.add(axesHelper);

      // ! work to be done on the partition opening sketch
      if (activeWall.includes('partition') || activeWall.includes('partRoof')) {
        const { building, roof, buildingLines, roofLines } = createBuilding(
          state.buildings[activeBuilding],
          true
        );
        // scene.add(building, roof, buildingLines, roofLines);
        scene.add(buildingLines, roofLines);

        addBayLines(
          state.buildings[activeBuilding].leftBaySpacing,
          'leftEndwall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].rightBaySpacing,
          'rightEndwall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].frontBaySpacing,
          'frontSidewall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].backBaySpacing,
          'backSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        // todo add activeWall to this function call to display just this partition on Opening Sketches
        addPartitions(
          scene,
          state.buildings[activeBuilding],
          activePartition,
          activeWall
        );

        // if (part.orientation == 'l') {
        //   const calcHeight = calculateHeightAtPosition(
        //     state.buildings[activeBuilding],
        //     part.offset
        //   );
        // } else {
        // }
        // const { building, roof, buildingL,ines, roofLines } = createBuilding(
        //   state.buildings[activeBuilding],
        //   true
        // );
        // scene.add(buildingLines);
        // addBayLines(
        //   state.buildings[activeBuilding].frontBaySpacing,
        //   'frontSidewall',
        //   scene,
        //   state.buildings[activeBuilding]
        // );
      } else {
        const { building, roof, buildingLines, roofLines } = createBuilding(
          state.buildings[activeBuilding],
          true
        );

        scene.add(building, roof, buildingLines, roofLines);

        // Add all the additional building elements
        addBayLines(
          state.buildings[activeBuilding].leftBaySpacing,
          'leftEndwall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].rightBaySpacing,
          'rightEndwall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].frontBaySpacing,
          'frontSidewall',
          scene,
          state.buildings[activeBuilding]
        );
        addBayLines(
          state.buildings[activeBuilding].backBaySpacing,
          'backSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        // Add bracing
        addBraceLines(
          state.buildings[activeBuilding].frontBaySpacing,
          state.buildings[activeBuilding].frontBracedBays,
          'frontSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        addBraceLines(
          state.buildings[activeBuilding].backBaySpacing,
          state.buildings[activeBuilding].backBracedBays,
          'backSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        addBraceLines(
          state.buildings[activeBuilding].leftBaySpacing,
          state.buildings[activeBuilding].leftBracedBays,
          'leftEndwall',
          scene,
          state.buildings[activeBuilding]
        );

        addBraceLines(
          state.buildings[activeBuilding].rightBaySpacing,
          state.buildings[activeBuilding].rightBracedBays,
          'rightEndwall',
          scene,
          state.buildings[activeBuilding]
        );

        addBraceLines(
          state.buildings[activeBuilding].roofBaySpacing,
          state.buildings[activeBuilding].roofBracedBays,
          'roof',
          scene,
          state.buildings[activeBuilding]
        );

        // Add extensions
        addExtensions(
          state.buildings[activeBuilding].frontBaySpacing,
          'frontSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        addExtensions(
          state.buildings[activeBuilding].backBaySpacing,
          'backSidewall',
          scene,
          state.buildings[activeBuilding]
        );

        addExtensions(
          state.buildings[activeBuilding].leftBaySpacing,
          'leftEndwall',
          scene,
          state.buildings[activeBuilding]
        );

        addExtensions(
          state.buildings[activeBuilding].rightBaySpacing,
          'rightEndwall',
          scene,
          state.buildings[activeBuilding]
        );

        addOpenings(scene, state.buildings[activeBuilding]);
      }

      // Render the scene
      if (renderer && camera) {
        renderer.render(scene, camera);
      }
    },
    [
      state.buildings[activeBuilding],
      isSetup,
      scene,
      renderer,
      camera,
      activePartition,
    ]
  );

  // Update building when needed
  useEffect(() => {
    if (isSetup) {
      updateBuilding(activeWall);
    }
  }, [state.buildings[activeBuilding], isSetup, updateBuilding, activeWall]);

  // Mount canvas
  useEffect(() => {
    if (renderer && !canvasRef.current) {
      canvasRef.current = renderer.domElement;
      mountRef.current.appendChild(canvasRef.current);
    }
  }, [renderer]);

  return <div className="openingSketch" ref={mountRef} />;
};

export default BuildingFlatSketch;
