import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BuildingSketch = ({ buildingData, backgroundColor = 0xf5f5f5 }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;

    // Setup scene, camera, renderer only once
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(backgroundColor);
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000
      );
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(rendererRef.current.domElement);

      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
    }

    // Function to update or create the building
    const updateBuilding = () => {
      // Clear existing meshes
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }

      const width = Number(buildingData.width) || 10;
      const length = Number(buildingData.length) || 10;
      const eaveHeight = Number(buildingData.eaveHeight) || 5;
      const roofPitch = Number(buildingData.roofPitch) || 1;

      // Create building
      const buildingGeometry = new THREE.BoxGeometry(width, eaveHeight, length);
      const buildingMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.7,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.y = eaveHeight / 2; // Center the building vertically
      sceneRef.current.add(building);

      // Add roof
      const roofHeight = (width / 2) * Math.tan((roofPitch * Math.PI) / 180);
      const roofGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -width / 2,
        0,
        length / 2,
        width / 2,
        0,
        length / 2,
        0,
        roofHeight,
        0,
        -width / 2,
        0,
        -length / 2,
        width / 2,
        0,
        -length / 2,
      ]);
      const indices = [0, 1, 2, 3, 4, 2, 0, 2, 3, 1, 4, 2];
      roofGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3)
      );
      roofGeometry.setIndex(indices);
      roofGeometry.computeVertexNormals();

      const roofMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = eaveHeight; // Place the roof at the eave height
      sceneRef.current.add(roof);

      // Add edges to building and roof
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const buildingEdges = new THREE.EdgesGeometry(buildingGeometry);
      const buildingLines = new THREE.LineSegments(
        buildingEdges,
        edgesMaterial
      );
      buildingLines.position.y = eaveHeight / 2; // Match building position
      sceneRef.current.add(buildingLines);

      const roofEdges = new THREE.EdgesGeometry(roofGeometry);
      const roofLines = new THREE.LineSegments(roofEdges, edgesMaterial);
      roofLines.position.y = eaveHeight; // Match roof position
      sceneRef.current.add(roofLines);

      // Update camera position
      cameraRef.current.position.set(
        width * 1.5,
        eaveHeight * 1.5,
        length * 1.5
      );
      cameraRef.current.lookAt(0, eaveHeight / 2, 0);
    };

    updateBuilding();

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
      }
      // Clear all references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [buildingData, backgroundColor]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default BuildingSketch;
