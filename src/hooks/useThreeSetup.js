import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const useThreeSetup = (
  mountRef,
  backgroundColor,
  buildingDimensions,
  currentView
) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);
  const animateRef = useRef(null);

  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isSetup) return;

    const mount = mountRef.current;

    // Setup scene
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(backgroundColor);

    // Setup camera
    const aspect = mount.clientWidth / mount.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(rendererRef.current.domElement);

    // Setup OrbitControls
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.25;
    controlsRef.current.enableZoom = true;
    controlsRef.current.enablePan = true;

    // Enable controls by default
    controlsRef.current.enabled = true;

    // Define the animate function
    animateRef.current = () => {
      frameIdRef.current = requestAnimationFrame(animateRef.current);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Start the animation loop
    animateRef.current();

    setIsSetup(true);

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [mountRef, backgroundColor]);

  const updateCameraPosition = useCallback(
    (view) => {
      if (!isSetup || !cameraRef.current || !controlsRef.current) return;

      const { width, length, eaveHeight } = buildingDimensions;
      const maxDimension = Math.max(width, length, eaveHeight);
      const distance = maxDimension * 1.35;

      // Enable controls for all views
      controlsRef.current.enabled = true;

      let targetPosition = new THREE.Vector3(0, eaveHeight / 2, 0);

      switch (view) {
        case 'LEW': // Left Endwall view
          cameraRef.current.position.set(0, eaveHeight / 2, distance);
          break;
        case 'REW': // Right Endwall view
          cameraRef.current.position.set(0, eaveHeight / 2, -distance);
          break;
        case 'FSW': // Front Sidewall view
          cameraRef.current.position.set(distance, eaveHeight / 2, 0);
          break;
        case 'BSW': // Back Sidewall view
          cameraRef.current.position.set(-distance, eaveHeight / 2, 0);
          break;
        case 'TOP': // Top view
          cameraRef.current.position.set(0, distance, 0);
          targetPosition.set(-1, 0, 0);
          break;
        default: // ISO view and free view
          cameraRef.current.position.set(
            distance * 0.6,
            distance * 0.6,
            distance * 0.6
          );
      }

      cameraRef.current.lookAt(targetPosition);
      controlsRef.current.target.copy(targetPosition);
      // cameraRef.current.lookAt(0, eaveHeight / 2, 0);
      // controlsRef.current.target.set(0, eaveHeight / 2, 0);
      controlsRef.current.update();

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    },
    [buildingDimensions, isSetup]
  );

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    isSetup,
    updateCameraPosition,
  };
};
