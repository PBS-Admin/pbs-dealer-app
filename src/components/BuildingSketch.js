import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeSetup } from '../hooks/useThreeSetup';
import { createBuilding, addBayLines, addBraceLines } from './BuildingUtils';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

const BuildingSketch = () => {
  const backgroundColor = 0xf5f5f5;
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const updateCountRef = useRef(0);
  const [currentView, setCurrentView] = useState('ISO');
  const { state } = useBuildingContext();
  const { activeBuilding } = useUIContext();
  const { scene, camera, renderer, controls, isSetup, updateCameraPosition } =
    useThreeSetup(
      mountRef,
      backgroundColor,
      {
        width: state.buildings[activeBuilding].width,
        length: state.buildings[activeBuilding].length,
        height: state.buildings[activeBuilding].backEaveHeight,
      },
      currentView
    );

  console.log(state.projectName);

  const updateBuilding = useCallback(() => {
    updateCountRef.current++;
    if (!isSetup || !scene) return;

    // Remove existing building objects
    scene.children = scene.children.filter(
      (child) =>
        ![
          'building',
          'roof',
          'buildingLines',
          'roofLines',
          'axesHelper',
        ].includes(child.name)
    );

    // Add an axes helper
    const axesHelper = new THREE.AxesHelper(100);
    axesHelper.name = 'axesHelper';
    scene.add(axesHelper);

    const { building, roof, buildingLines, roofLines } = createBuilding(
      state.buildings[activeBuilding]
    );

    // Assign names to the objects for easier identification
    building.name = 'building';
    roof.name = 'roof';
    buildingLines.name = 'buildingLines';
    roofLines.name = 'roofLines';

    scene.add(building, roof, buildingLines, roofLines);

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
      state.buildings[activeBuilding].roofBaySpacing,
      'frontSidewall',
      scene,
      state.buildings[activeBuilding]
    );

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

    // Render the scene
    if (renderer && camera) {
      renderer.render(scene, camera);
    }
  }, [state.buildings[activeBuilding], isSetup, scene, renderer, camera]);

  useEffect(() => {
    if (isSetup) {
      updateBuilding();
    }
  }, [state.buildings[activeBuilding], isSetup, updateBuilding]);

  useEffect(() => {
    if (isSetup) {
      updateCameraPosition(currentView);
    }
  }, [currentView, isSetup, updateCameraPosition]);

  useEffect(() => {
    if (renderer && !canvasRef.current) {
      canvasRef.current = renderer.domElement;
      mountRef.current.appendChild(canvasRef.current);
    }
  }, [renderer]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div>
      <div
        ref={mountRef}
        style={{
          width: '300px',
          height: '300px',
        }}
      />
      <div className="sketchButtonContainer">
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('LEW')}
        >
          LEW
        </button>
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('REW')}
        >
          REW
        </button>
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('FSW')}
        >
          FSW
        </button>
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('BSW')}
        >
          BSW
        </button>
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('TOP')}
        >
          TOP
        </button>
        <button
          type="button"
          className="sketchButton"
          onClick={() => handleViewChange('ISO')}
        >
          ISO
        </button>
      </div>
    </div>
  );
};

export default BuildingSketch;
