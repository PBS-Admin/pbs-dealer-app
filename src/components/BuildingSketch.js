// Component that shows a 3D sketch of the active building in the Builing Context
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeSetup } from '../hooks/useThreeSetup';
import {
  createBuilding,
  addBayLines,
  addBraceLines,
  addExtensions,
  addOpenings,
  addPartitions,
} from './BuildingUtils';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

const BuildingSketch = () => {
  const backgroundColor = 0xf5f5f5;
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const { state } = useBuildingContext();
  const {
    activeBuilding,
    camera: cameraState,
    updateCameraState,
  } = useUIContext();

  const { scene, camera, renderer, controls, isSetup, updateCameraPosition } =
    useThreeSetup(
      mountRef,
      backgroundColor,
      {
        width: state.buildings[activeBuilding].width,
        length: state.buildings[activeBuilding].length,
        height: state.buildings[activeBuilding].backEaveHeight,
      },
      cameraState.view
    );

  const timeoutRef = useRef(null);

  // Update context when user interacts with controls
  useEffect(() => {
    if (controls) {
      const handleChange = () => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          if (camera && controls) {
            updateCameraState(
              camera.position,
              controls.target,
              cameraState.view
            );
          }
        }, 100); // 100ms delay
      };

      controls.addEventListener('change', handleChange);

      return () => {
        controls.removeEventListener('change', handleChange);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [controls, camera, updateCameraState, cameraState.view]);

  // Restore camera position from context when available
  useEffect(() => {
    if (camera && controls && cameraState.position && cameraState.target) {
      const shouldUpdate = !camera.position.equals(
        new THREE.Vector3(
          cameraState.position.x,
          cameraState.position.y,
          cameraState.position.z
        )
      );

      if (shouldUpdate) {
        camera.position.set(
          cameraState.position.x,
          cameraState.position.y,
          cameraState.position.z
        );
        controls.target.set(
          cameraState.target.x,
          cameraState.target.y,
          cameraState.target.z
        );
        controls.update();
      }
    }
  }, [camera, controls, cameraState.view]);

  const updateBuilding = useCallback(() => {
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
      state.buildings[activeBuilding],
      false
    );

    // Assign names to the objects for easier identification
    building.name = 'building';
    roof.name = 'roof';
    buildingLines.name = 'buildingLines';
    roofLines.name = 'roofLines';

    // scene.add(building, roof, buildingLines, roofLines);
    scene.add(building, buildingLines, roof, roofLines);

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

    addPartitions(scene, state.buildings[activeBuilding]);

    // Render the scene
    if (renderer && camera) {
      renderer.render(scene, camera);
    }
  }, [state.buildings[activeBuilding], isSetup, scene, renderer, camera]);

  // Update building when needed
  useEffect(() => {
    if (isSetup) {
      updateBuilding();
    }
  }, [state.buildings[activeBuilding], isSetup, updateBuilding]);

  // Mount canvas
  useEffect(() => {
    if (renderer && !canvasRef.current) {
      canvasRef.current = renderer.domElement;
      mountRef.current.appendChild(canvasRef.current);
    }
  }, [renderer]);

  // Add effect to initialize camera state after setup
  useEffect(() => {
    if (isSetup && camera && controls && !cameraState.position) {
      // Sync initial camera state to context
      updateCameraState(camera.position, controls.target, 'ISO');
      // Set initial view
      updateCameraPosition('ISO');
    }
  }, [
    isSetup,
    camera,
    controls,
    cameraState.position,
    updateCameraState,
    updateCameraPosition,
  ]);

  const handleViewChange = (view) => {
    // First update the camera position for the new view
    updateCameraPosition(view);
    // Then store the new position and view in context
    updateCameraState(camera.position, controls.target, view);
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
