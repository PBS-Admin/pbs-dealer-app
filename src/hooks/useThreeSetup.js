import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useThreeSetup = (
  mountRef,
  backgroundColor,
  buildingDimensions,
  currentView
) => {
  console.log('useThreeSetup called', {
    backgroundColor,
    buildingDimensions,
    currentView,
  });

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    console.log('useThreeSetup useEffect triggered', {
      isSetup,
      mountRef: mountRef.current,
    });
    if (!mountRef.current || isSetup) return;

    console.log('Setting up Three.js environment');

    const mount = mountRef.current;

    // Check if mount element is visible
    const mountRect = mount.getBoundingClientRect();
    console.log('Mount element dimensions:', mountRect);
    if (mountRect.width === 0 || mountRect.height === 0) {
      console.error('Mount element has zero width or height');
      return;
    }

    // Setup scene
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(backgroundColor);

    // Setup camera
    const aspect = mount.clientWidth / mount.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    // Initial camera position
    const { width, length, eaveHeight } = buildingDimensions;
    const distance = Math.max(width, length, eaveHeight) * 2;
    cameraRef.current.position.set(distance, distance, distance);
    cameraRef.current.lookAt(0, 0, 0);

    // Add a test cube
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    sceneRef.current.add(cube);
    console.log('Test cube added to scene');

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, 50, 50);
    sceneRef.current.add(light);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(100);
    sceneRef.current.add(axesHelper);

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(rendererRef.current.domElement);

    // Perform initial render
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    console.log('Initial render performed');

    setIsSetup(true);
    console.log('Three.js setup complete');

    // Cleanup function
    return () => {
      console.log('Cleaning up Three.js environment');
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, [mountRef, backgroundColor, isSetup, buildingDimensions]);

  const updateCameraPosition = useCallback(
    (view) => {
      console.log('updateCameraPosition called', {
        view,
        isSetup,
        camera: cameraRef.current,
      });
      if (!isSetup || !cameraRef.current) return;

      const { width, length, eaveHeight } = buildingDimensions;
      const distance = Math.max(width, length, eaveHeight) * 1.5;

      switch (view) {
        case 'L':
          cameraRef.current.position.set(-distance, eaveHeight / 2, 0);
          break;
        case 'R':
          cameraRef.current.position.set(distance, eaveHeight / 2, 0);
          break;
        case 'FS':
          cameraRef.current.position.set(0, eaveHeight / 2, distance);
          break;
        case 'BS':
          cameraRef.current.position.set(0, eaveHeight / 2, -distance);
          break;
        case 'T':
          cameraRef.current.position.set(0, distance, 0);
          break;
        default: // ISO view
          cameraRef.current.position.set(distance, distance, distance);
      }
      cameraRef.current.lookAt(0, eaveHeight / 2, 0);
      console.log('Camera position updated:', cameraRef.current.position);

      // Re-render the scene after camera update
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        console.log('Scene re-rendered after camera update');
      }
    },
    [buildingDimensions, isSetup]
  );

  useEffect(() => {
    console.log('Camera update useEffect triggered', { currentView, isSetup });
    updateCameraPosition(currentView);
  }, [currentView, updateCameraPosition]);

  const animate = useCallback(() => {
    frameIdRef.current = requestAnimationFrame(animate);
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    animate,
    isSetup,
    updateCameraPosition,
  };
};
