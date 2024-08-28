import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useThreeSetup = (
  mountRef,
  backgroundColor,
  buildingDimensions,
  currentView
) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

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
    };
  }, [mountRef, backgroundColor, isSetup]);

  const updateCameraPosition = useCallback(
    (view) => {
      if (!isSetup || !cameraRef.current) return;

      const {
        shape,
        width,
        length,
        lowEaveHeight,
        highEaveHeight,
        backEaveheight,
        frontEaveHeight,
        eaveHeight,
      } = buildingDimensions;
      const maxDimension = Math.max(width, length, eaveHeight);
      const distance = maxDimension * 1.15;

      console.log(shape);

      const vertHeight = (() => {
        switch (shape) {
          case 'symmetrical':
            return eaveHeight;
          case 'singleSlope':
          case 'leanTo':
            return Math.max(lowEaveHeight, highEaveHeight);
          case 'nonSymmetrical':
            return Math.max(backEaveheight, frontEaveHeight);
          default:
            console.warn(
              `Unknown shape: ${shape}. Using eaveHeight as fallback.`
            );
            return eaveHeight;
        }
      })();

      switch (view) {
        case 'L': // Left Endwall view
          cameraRef.current.position.set(0, vertHeight / 2, width * 1.5);
          cameraRef.current.lookAt(0, vertHeight / 2, 0);

          break;
        case 'R': // Right Endwall view
          cameraRef.current.position.set(0, vertHeight / 2, -width * 1.5);
          cameraRef.current.lookAt(0, vertHeight / 2, 0);
          break;
        case 'FS': // Front Sidewall view
          cameraRef.current.position.set(length * 1.25, vertHeight / 2, 0);
          cameraRef.current.lookAt(0, vertHeight / 2, 0);

          break;
        case 'BS': // Back Sidewall view
          cameraRef.current.position.set(-length * 1.25, vertHeight / 2, 0);
          cameraRef.current.lookAt(0, vertHeight / 2, 0);
          break;
        case 'T': // Top view
          cameraRef.current.position.set(0, distance, 0);
          cameraRef.current.lookAt(0, 0, 0);
          break;
        default: // ISO view
          cameraRef.current.position.set(
            distance * 0.6,
            distance * 0.6,
            distance * 0.6
          );
          cameraRef.current.lookAt(0, vertHeight / 2, 0);
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    },
    [buildingDimensions, isSetup]
  );

  useEffect(() => {
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
