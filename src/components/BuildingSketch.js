import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeSetup } from '../hooks/useThreeSetup';
import { createBuilding, addBayLines, addBraceLines } from './BuildingUtils';

const BuildingSketch = ({ buildingData, backgroundColor = 0xf5f5f5 }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const updateCountRef = useRef(0);
  const [currentView, setCurrentView] = useState('ISO');
  const { scene, camera, renderer, controls, isSetup, updateCameraPosition } =
    useThreeSetup(
      mountRef,
      backgroundColor,
      {
        width: buildingData.width,
        length: buildingData.length,
        height: buildingData.backEaveHeight,
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

    addBayLines(
      buildingData.leftBaySpacing,
      'leftEndwall',
      scene,
      buildingData
    );
    addBayLines(
      buildingData.rightBaySpacing,
      'rightEndwall',
      scene,
      buildingData
    );
    addBayLines(
      buildingData.roofBaySpacing,
      'frontSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.frontBaySpacing,
      buildingData.frontBracedBays,
      'frontSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.backBaySpacing,
      buildingData.backBracedBays,
      'backSidewall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.leftBaySpacing,
      buildingData.leftBracedBays,
      'leftEndwall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.rightBaySpacing,
      buildingData.rightBracedBays,
      'rightEndwall',
      scene,
      buildingData
    );

    addBraceLines(
      buildingData.roofBaySpacing,
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
