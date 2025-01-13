import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

const OpeningSketch = ({ wallType }) => {
  const mountRef = useRef(null);
  const { state } = useBuildingContext();
  const { activeBuilding } = useUIContext();
  const building = state.buildings[activeBuilding];

  const calculateHeightAtPosition = (pos, isRightWall = false) => {
    const {
      shape,
      backPeakOffset,
      width,
      backEaveHeight,
      backRoofPitch,
      frontRoofPitch,
    } = building;
    const adjustedPos = isRightWall ? width - pos : pos;

    switch (shape) {
      case 'symmetrical': {
        const distanceFromCenter = Math.abs(width / 2 - adjustedPos);
        return (
          ((width / 2 - distanceFromCenter) * backRoofPitch) / 12 +
          backEaveHeight
        );
      }
      case 'singleSlope':
      case 'leanTo': {
        return (adjustedPos * backRoofPitch) / 12 + backEaveHeight;
      }
      case 'nonSymmetrical': {
        if (adjustedPos <= backPeakOffset) {
          return (adjustedPos * backRoofPitch) / 12 + backEaveHeight;
        } else {
          const distanceFromPeak = adjustedPos - backPeakOffset;
          const peakHeight =
            backEaveHeight + (backPeakOffset * backRoofPitch) / 12;
          return peakHeight - (distanceFromPeak * frontRoofPitch) / 12;
        }
      }
      default:
        return backEaveHeight;
    }
  };

  useEffect(() => {
    if (!mountRef.current || !building) return;

    // Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Get wall dimensions and create wall outline points
    let wallWidth, wallPoints;
    const padding = 20;

    // Convert wallType to match your data structure
    const normalizedWallType = wallType.toLowerCase();

    // Determine wall dimensions and points
    if (normalizedWallType === 'front') {
      wallWidth = building.length;
      wallPoints = [
        new THREE.Vector2(wallWidth / 2, building.frontEaveHeight), // Top right
        new THREE.Vector2(-wallWidth / 2, building.frontEaveHeight), // Top left
        new THREE.Vector2(-wallWidth / 2, 0), // Bottom left
        new THREE.Vector2(wallWidth / 2, 0), // Bottom right
        new THREE.Vector2(wallWidth / 2, building.frontEaveHeight), // Top right
        new THREE.Vector2(
          wallWidth / 2,
          calculateHeightAtPosition(building.backPeakOffset)
        ), // Roof right
        new THREE.Vector2(
          -wallWidth / 2,
          calculateHeightAtPosition(building.backPeakOffset)
        ), // Roof left
        new THREE.Vector2(-wallWidth / 2, building.frontEaveHeight), // Top left
      ];
    } else if (normalizedWallType === 'back') {
      wallWidth = building.length;
      wallPoints = [
        new THREE.Vector2(wallWidth / 2, building.backEaveHeight), // Top right
        new THREE.Vector2(-wallWidth / 2, building.backEaveHeight), // Top left
        new THREE.Vector2(-wallWidth / 2, 0), // Bottom left
        new THREE.Vector2(wallWidth / 2, 0), // Bottom right
        new THREE.Vector2(wallWidth / 2, building.backEaveHeight), // Top right
        new THREE.Vector2(
          wallWidth / 2,
          calculateHeightAtPosition(building.backPeakOffset)
        ), // Roof right
        new THREE.Vector2(
          -wallWidth / 2,
          calculateHeightAtPosition(building.backPeakOffset)
        ), // Roof left
        new THREE.Vector2(-wallWidth / 2, building.backEaveHeight), // Top left
      ];
    } else if (
      normalizedWallType === 'left' ||
      normalizedWallType === 'right'
    ) {
      wallWidth = building.width;
      const isRightWall = normalizedWallType === 'right';

      // Base points for endwalls starting from ground
      wallPoints = [
        new THREE.Vector2(-wallWidth / 2, 0), // Bottom left
        new THREE.Vector2(wallWidth / 2, 0), // Bottom right
      ];

      // Add roof points based on building shape
      if (building.shape === 'symmetrical') {
        wallPoints.push(
          new THREE.Vector2(wallWidth / 2, building.backEaveHeight), // Right eave
          new THREE.Vector2(
            0,
            calculateHeightAtPosition(wallWidth / 2, isRightWall)
          ), // Peak
          new THREE.Vector2(-wallWidth / 2, building.backEaveHeight) // Left eave
        );
      } else if (
        building.shape === 'singleSlope' ||
        building.shape === 'leanTo'
      ) {
        wallPoints.push(
          new THREE.Vector2(wallWidth / 2, building.frontEaveHeight),
          new THREE.Vector2(-wallWidth / 2, building.backEaveHeight)
        );
      } else if (building.shape === 'nonSymmetrical') {
        const peakPosition = isRightWall
          ? building.width - building.backPeakOffset
          : building.backPeakOffset;
        const peakX = peakPosition - wallWidth / 2;
        const peakHeight = calculateHeightAtPosition(peakPosition, isRightWall);

        wallPoints.push(
          new THREE.Vector2(
            wallWidth / 2,
            isRightWall ? building.backEaveHeight : building.frontEaveHeight
          ),
          new THREE.Vector2(peakX, peakHeight),
          new THREE.Vector2(
            -wallWidth / 2,
            isRightWall ? building.frontEaveHeight : building.backEaveHeight
          )
        );
      }
    } else {
      wallWidth = building.length;
      wallPoints = [
        new THREE.Vector2(wallWidth / 2, building.frontEaveHeight), // Top right
        new THREE.Vector2(-wallWidth / 2, building.frontEaveHeight), // Top left
      ];
      console.log('wall type is: ', wallType);
    }

    // Create wall outline
    const shape = new THREE.Shape(wallPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      shape.getPoints()
    );
    const outline = new THREE.LineLoop(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    scene.add(outline);

    // Add bay lines
    const baySpacingProp = `${normalizedWallType}BaySpacing`;
    const baySpacing = building[baySpacingProp];

    if (baySpacing && Array.isArray(baySpacing)) {
      let currentPos = 0;
      baySpacing.forEach((space, index) => {
        if (index === 0) {
          currentPos += space;
          return;
        }

        const lineGeometry = new THREE.BufferGeometry();
        let linePoints;

        if (['left', 'right'].includes(normalizedWallType)) {
          const isRightWall = normalizedWallType === 'right';
          const height = calculateHeightAtPosition(currentPos, isRightWall);

          linePoints = [
            new THREE.Vector2(currentPos - wallWidth / 2, 0),
            new THREE.Vector2(currentPos - wallWidth / 2, height),
          ];
        } else {
          linePoints = [
            new THREE.Vector2(currentPos - wallWidth / 2, 0),
            new THREE.Vector2(
              currentPos - wallWidth / 2,
              calculateHeightAtPosition(building.backPeakOffset)
            ),
          ];
        }

        lineGeometry.setFromPoints(linePoints);
        const line = new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({ color: 0x666666 })
        );
        scene.add(line);

        currentPos += space;
      });
    }

    // Camera setup
    const maxHeight = Math.max(...wallPoints.map((p) => p.y));
    const viewWidth = wallWidth + padding * 2;
    const aspectRatio = width / height;

    // Adjust camera to center the view on the building while maintaining ground at 0
    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      maxHeight + padding,
      -padding,
      1,
      1000
    );
    camera.position.z = 100;
    camera.updateProjectionMatrix();

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
