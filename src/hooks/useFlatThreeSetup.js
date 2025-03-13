import { useState, useEffect, useRef, useCallback, act } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const useFlatThreeSetup = (
  mountRef,
  backgroundColor,
  buildingDimensions,
  activeWall,
  padding = 20
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

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(rendererRef.current.domElement);

    // Initialize with a default orthographic camera
    const aspect = mount.clientWidth / mount.clientHeight;
    const frustumSize = 100;

    if (activeWall == 'right' || activeWall == 'left') {
      console.log(buildingDimensions.width);
      console.log(buildingDimensions.height);
      cameraRef.current = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        buildingDimensions.length * 1.5 + 1
      );
    } else if (activeWall == 'front') {
      cameraRef.current = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        (buildingDimensions.width + buildingDimensions.backPeakOffset) * 1.5 + 1
      );
    } else if (activeWall == 'back') {
      cameraRef.current = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        (buildingDimensions.width - buildingDimensions.backPeakOffset) * 1.5 + 1
      );
    } else {
      cameraRef.current = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        (buildingDimensions.width + buildingDimensions.backPeakOffset) * 1.5 + 1
      );
    }

    // Setup OrbitControls with restrictions
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.25;
    controlsRef.current.enableZoom = true;
    controlsRef.current.enablePan = true;
    controlsRef.current.enableRotate = false; // Disable rotation

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
    (wall) => {
      if (!isSetup || !cameraRef.current || !controlsRef.current) return;

      const { width, length, height, partitions } = buildingDimensions;

      if (wall.includes('partition')) {
        const part = partitions[parseInt(wall.replace('partition', '')) - 1];
        wall = part.orientation == 't' ? 'partitionT' : 'partitionL';
      }

      // Helper to set up orthographic camera for different views
      const setupOrthographicView = (viewWidth, viewHeight, position) => {
        const aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        const finalWidth = viewWidth + padding * 2;
        const finalHeight = viewHeight + padding * 2;

        // Adjust the camera frustum to fit the view
        let left, right, top, bottom;
        if (aspect > finalWidth / finalHeight) {
          // Width constrained by height
          top = finalHeight / 2;
          bottom = -finalHeight / 2;
          left = (-finalHeight * aspect) / 2;
          right = (finalHeight * aspect) / 2;
        } else {
          // Height constrained by width
          left = -finalWidth / 2;
          right = finalWidth / 2;
          top = finalWidth / (2 * aspect);
          bottom = -finalWidth / (2 * aspect);
        }

        cameraRef.current.left = left;
        cameraRef.current.right = right;
        cameraRef.current.top = top;
        cameraRef.current.bottom = bottom;
        cameraRef.current.position.copy(position);
        cameraRef.current.lookAt(new THREE.Vector3(0, height / 2, 0));
        cameraRef.current.updateProjectionMatrix();
      };

      switch (wall) {
        case 'left': // Left wall view
          setupOrthographicView(
            width,
            height,
            new THREE.Vector3(0, height / 2, length * 1.5)
          );
          break;
        case 'right': // Right wall view
          setupOrthographicView(
            width,
            height,
            new THREE.Vector3(0, height / 2, -length * 1.5)
          );
          break;
        case 'front': // Front wall view
          setupOrthographicView(
            length,
            height,
            new THREE.Vector3(width * 1.5, height / 2, 0)
          );
          break;
        case 'back': // Back wall view
          setupOrthographicView(
            length,
            height,
            new THREE.Vector3(-width * 1.5, height / 2, 0)
          );
          break;
        case 'partitionT': // Back wall view
          setupOrthographicView(
            width,
            height,
            new THREE.Vector3(0, height / 2, length * 1.5)
          );
          break;
        case 'partitionL': // Back wall view
          setupOrthographicView(
            length,
            height,
            new THREE.Vector3(width * 1.5, height / 2, 0)
          );
          break;
        case 'partRoof': // Roof view
          setupOrthographicView(
            width,
            length,
            new THREE.Vector3(1, height * 2, 0)
          );
          break;
        case 'roof': // Roof view
          setupOrthographicView(
            width,
            length,
            new THREE.Vector3(1, height * 2, 0)
          );
          break;
      }

      controlsRef.current.target.set(0, height / 2, 0);
      controlsRef.current.update();

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    },
    [buildingDimensions, isSetup, padding]
  );

  // Update camera when activeWall changes
  useEffect(() => {
    if (isSetup && activeWall) {
      updateCameraPosition(activeWall);
    }
  }, [isSetup, activeWall, updateCameraPosition]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    isSetup,
  };
};
