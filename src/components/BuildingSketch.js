import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeSetup } from '../hooks/useThreeSetup';
import { createBuilding, addBayLines, addBraceLines } from './BuildingUtils';

const BuildingSketch = ({
  buildingData,
  lastChangedWall,
  backgroundColor = 0xf5f5f5,
}) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const updateCountRef = useRef(0);
  const [currentView, setCurrentView] = useState('ISO');
  const { scene, camera, renderer, animate, isSetup, updateCameraPosition } =
    useThreeSetup(
      mountRef,
      backgroundColor,
      {
        width: buildingData.width,
        length: buildingData.length,
        eaveHeight: buildingData.eaveHeight,
      },
      currentView
    );

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

    const { building, roof, buildingLines, roofLines } =
      createBuilding(buildingData);

    // Assign names to the objects for easier identification
    building.name = 'building';
    roof.name = 'roof';
    buildingLines.name = 'buildingLines';
    roofLines.name = 'roofLines';

    scene.add(building, roof, buildingLines, roofLines);

    addBayLines(buildingData.lewBaySpacing, 'leftEndwall', scene, buildingData);
    addBayLines(
      buildingData.rewBaySpacing,
      'rightEndwall',
      scene,
      buildingData
    );
    addBayLines(
      buildingData.sidewallBaySpacing,
      'frontSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.sidewallBaySpacing,
      buildingData.fswBracedBays,
      'frontSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.sidewallBaySpacing,
      buildingData.bswBracedBays,
      'backSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.lewBaySpacing,
      buildingData.lewBracedBays,
      'leftEndwall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.rewBaySpacing,
      buildingData.rewBracedBays,
      'rightEndwall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.sidewallBaySpacing,
      buildingData.roofBracedBays,
      'roof',
      scene,
      buildingData
    );

    // Render the scene
    if (renderer && camera) {
      renderer.render(scene, camera);
    }
  }, [buildingData, isSetup, scene, renderer, camera]);

  useEffect(() => {
    if (isSetup) {
      updateBuilding();
    }
  }, [buildingData, isSetup, updateBuilding]);

  useEffect(() => {
    if (!isSetup) return;

    updateBuilding();
    animate();
  }, [isSetup, updateBuilding, animate]);

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
      <div ref={mountRef} style={{ width: '250px', height: '250px' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <button onClick={() => handleViewChange('L')}>L</button>
        <button onClick={() => handleViewChange('R')}>R</button>
        <button onClick={() => handleViewChange('FS')}>FS</button>
        <button onClick={() => handleViewChange('BS')}>BS</button>
        <button onClick={() => handleViewChange('T')}>T</button>
        <button onClick={() => handleViewChange('ISO')}>ISO</button>
      </div>
    </div>
  );
};

export default BuildingSketch;
