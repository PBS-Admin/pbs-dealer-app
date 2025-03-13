import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';
import {
  getWallPoints,
  createWallOutline,
  addWallBayLines,
  addBayLines,
  setupWallCamera,
} from './BuildingUtils';

const OpeningSketch = ({ wallType }) => {
  const mountRef = useRef(null);
  const { state } = useBuildingContext();
  const { activeBuilding } = useUIContext();
  const building = state.buildings[activeBuilding];

  useEffect(() => {
    if (!mountRef.current || !building) return;

    // Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Get wall dimensions and create wall outline
    const { wallWidth, wallPoints } = getWallPoints(building, wallType);

    // Create and add wall outline
    const outline = createWallOutline(wallPoints);
    scene.add(outline);

    // Add bay lines with custom material if needed
    addWallBayLines(scene, building, wallType);

    // Camera setup
    const maxHeight = Math.max(...wallPoints.map((p) => p.y));
    const camera = setupWallCamera(width, height, wallWidth, maxHeight);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    // Cleanup
    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [building, wallType]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '400px',
      }}
    />
  );
};

export default OpeningSketch;
