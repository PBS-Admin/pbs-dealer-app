import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BuildingSketch = ({ buildingData }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    // Create building geometry
    const { width, length, eaveHeight, roofPitch } = buildingData;
    const geometry = new THREE.BoxGeometry(width, eaveHeight, length);
    const material = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      wireframe: true,
    });
    const building = new THREE.Mesh(geometry, material);
    scene.add(building);

    // Add roof
    const roofHeight = (width / 2) * Math.tan((roofPitch * Math.PI) / 180);
    const roofGeometry = new THREE.ConeGeometry(width / 2, roofHeight, 4);
    const roofMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      wireframe: true,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = eaveHeight + roofHeight / 2;
    scene.add(roof);

    // Position camera
    camera.position.set(width, eaveHeight, length);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [buildingData]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default BuildingSketch;
