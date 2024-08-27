import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeSetup } from '../hooks/useThreeSetup';
import { createBuilding, addBayLines } from './BuildingUtils';

const BuildingSketch = ({
  buildingData,
  lastChangedWall,
  backgroundColor = 0xf5f5f5,
}) => {
  console.log('BuildingSketch render', { buildingData, lastChangedWall });

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

  console.log('useThreeSetup returned', { scene, camera, renderer, isSetup });

  const updateBuilding = useCallback(() => {
    console.log('updateBuilding called', { isSetup, scene });
    updateCountRef.current++;
    console.log(`Update building called ${updateCountRef.current} times`);
    if (!isSetup || !scene) return;

    console.log('Updating building with data:', buildingData);

    // Remove existing building objects
    scene.children = scene.children.filter(
      (child) =>
        ![
          'building',
          'roof',
          'buildingLines',
          'roofLines',
          'gridHelper',
          'axesHelper',
          'testCube',
        ].includes(child.name)
    );

    // Add a grid helper
    const gridHelper = new THREE.GridHelper(200, 20);
    gridHelper.name = 'gridHelper';
    scene.add(gridHelper);

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

    console.log('Building created:', building);

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

    // Add a test cube
    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(
        buildingData.width,
        buildingData.eaveHeight,
        buildingData.length
      ),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    testCube.position.set(0, buildingData.eaveHeight / 2, 0);
    testCube.name = 'testCube';
    scene.add(testCube);

    if (camera) {
      const { width, length, eaveHeight } = buildingData;
      const distance = Math.max(width, length, eaveHeight) * 2;
      camera.position.set(distance, distance, distance);
      camera.lookAt(0, eaveHeight / 2, 0);
      console.log('Camera position:', camera.position);
      console.log(
        'Camera looking at:',
        new THREE.Vector3(0, eaveHeight / 2, 0)
      );
      console.log('Camera up vector:', camera.up);
    }

    if (renderer) {
      console.log('Renderer DOM element:', renderer.domElement);
      console.log('Renderer size:', renderer.getSize(new THREE.Vector2()));
    }

    console.log(
      'Scene contents:',
      scene.children.map((child) => ({ name: child.name, type: child.type }))
    );

    // Render the scene
    if (renderer && camera) {
      console.log('Rendering scene');
      renderer.render(scene, camera);
    } else {
      console.log('Cannot render: renderer or camera is null', {
        renderer,
        camera,
      });
    }
  }, [buildingData, isSetup, scene, renderer, camera]);

  useEffect(() => {
    console.log('First useEffect triggered', { isSetup });
    if (!isSetup) return;

    updateBuilding();
    animate();
    if (renderer && scene && camera) {
      console.log('Forcing render in first useEffect');
      renderer.render(scene, camera);
    }
  }, [isSetup, updateBuilding, animate, renderer, scene, camera]);

  useEffect(() => {
    console.log('Second useEffect triggered', { isSetup, currentView });
    if (isSetup) {
      updateCameraPosition(currentView);
      updateBuilding();
      if (renderer && scene && camera) {
        console.log('Forcing render in second useEffect');
        renderer.render(scene, camera);
      }
    }
  }, [
    currentView,
    isSetup,
    updateCameraPosition,
    updateBuilding,
    renderer,
    scene,
    camera,
  ]);

  useEffect(() => {
    if (renderer && !canvasRef.current) {
      canvasRef.current = renderer.domElement;
      mountRef.current.appendChild(canvasRef.current);
    }
  }, [renderer]);

  useEffect(() => {
    if (canvasRef.current) {
      const style = window.getComputedStyle(canvasRef.current);
      console.log('Canvas computed style:', {
        width: style.width,
        height: style.height,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
      });
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      console.log('Mount element rect:', rect);
      if (rect.width === 0 || rect.height === 0) {
        console.error('Mount element has zero width or height');
      }
    }
  }, []);

  const handleViewChange = (view) => {
    console.log('handleViewChange called', { view });
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
