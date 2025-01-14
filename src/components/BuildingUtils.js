import * as THREE from 'three';

export const createBuilding = (buildingData) => {
  const { shape } = buildingData;

  // Calculate vertices and indices for the complete building
  const { vertices, indices } = calculateBuildingGeometry(buildingData);

  // Create building mesh
  const buildingGeometry = new THREE.BufferGeometry();
  buildingGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(vertices, 3)
  );
  buildingGeometry.setIndex(indices);
  buildingGeometry.computeVertexNormals();

  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.7,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

  // Add edges
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const buildingEdges = new THREE.EdgesGeometry(buildingGeometry);
  const buildingLines = new THREE.LineSegments(buildingEdges, edgesMaterial);

  // Return empty objects for roof and roofLines to maintain compatibility
  const roof = new THREE.Mesh(new THREE.BufferGeometry());
  const roofLines = new THREE.LineSegments(new THREE.BufferGeometry());

  return { building, roof, buildingLines, roofLines };
};

const calculateBuildingGeometry = (buildingData) => {
  const {
    shape,
    width,
    length,
    backEaveHeight,
    frontEaveHeight = backEaveHeight,
    backRoofPitch,
    frontRoofPitch = backRoofPitch,
    backPeakOffset = width / 2,
  } = buildingData;

  let vertices, indices;

  switch (shape) {
    case 'symmetrical': {
      // Calculate peak height for symmetrical roof
      const peakHeight = ((width / 2) * backRoofPitch) / 12 + backEaveHeight;

      vertices = new Float32Array([
        // Left Endwall vertices (pentagon)
        -width / 2,
        0,
        length / 2, // 0: bottom left
        width / 2,
        0,
        length / 2, // 1: bottom right
        width / 2,
        backEaveHeight,
        length / 2, // 2: right eave
        0,
        peakHeight,
        length / 2, // 3: peak
        -width / 2,
        backEaveHeight,
        length / 2, // 4: left eave

        // Right Endwall vertices (pentagon)
        -width / 2,
        0,
        -length / 2, // 5: bottom left
        width / 2,
        0,
        -length / 2, // 6: bottom right
        width / 2,
        backEaveHeight,
        -length / 2, // 7: right eave
        0,
        peakHeight,
        -length / 2, // 8: peak
        -width / 2,
        backEaveHeight,
        -length / 2, // 9: left eave
      ]);

      indices = [
        // Left Endwall
        0, 1, 2, 0, 2, 3, 0, 3, 4,

        // Right Endwall
        5, 7, 6, 5, 8, 7, 5, 9, 8,

        // Back Wall
        0, 4, 9, 0, 9, 5,

        // Front Wall
        1, 6, 7, 1, 7, 2,

        // Roof Left
        4, 3, 8, 4, 8, 9,

        // Roof Right
        2, 7, 8, 2, 8, 3,

        // Floor
        0, 5, 6, 0, 6, 1,
      ];
      break;
    }

    case 'singleSlope':
    case 'leanTo': {
      vertices = new Float32Array([
        // Front Face vertices
        -width / 2,
        0,
        length / 2, // 0: bottom left
        width / 2,
        0,
        length / 2, // 1: bottom right
        width / 2,
        frontEaveHeight,
        length / 2, // 2: top right
        -width / 2,
        backEaveHeight,
        length / 2, // 3: top left

        // Back Face vertices
        -width / 2,
        0,
        -length / 2, // 4: bottom left
        width / 2,
        0,
        -length / 2, // 5: bottom right
        width / 2,
        frontEaveHeight,
        -length / 2, // 6: top right
        -width / 2,
        backEaveHeight,
        -length / 2, // 7: top left
      ]);

      indices = [
        // Front Face
        0, 1, 2, 0, 2, 3,

        // Back Face
        4, 6, 5, 4, 7, 6,

        // Left Wall
        0, 3, 7, 0, 7, 4,

        // Right Wall
        1, 5, 6, 1, 6, 2,

        // Roof
        3, 2, 6, 3, 6, 7,

        // Floor
        0, 4, 5, 0, 5, 1,
      ];
      break;
    }

    case 'nonSymmetrical': {
      const peakX = -width / 2 + backPeakOffset;
      const backRoofHeight =
        (backPeakOffset * backRoofPitch) / 12 + backEaveHeight;
      const frontRoofHeight =
        ((width - backPeakOffset) * frontRoofPitch) / 12 + frontEaveHeight;
      const peakHeight = Math.max(backRoofHeight, frontRoofHeight);

      vertices = new Float32Array([
        // Front Face vertices (pentagon)
        -width / 2,
        0,
        length / 2, // 0: bottom left
        width / 2,
        0,
        length / 2, // 1: bottom right
        width / 2,
        frontEaveHeight,
        length / 2, // 2: right eave
        peakX,
        peakHeight,
        length / 2, // 3: peak
        -width / 2,
        backEaveHeight,
        length / 2, // 4: left eave

        // Back Face vertices (pentagon)
        -width / 2,
        0,
        -length / 2, // 5: bottom left
        width / 2,
        0,
        -length / 2, // 6: bottom right
        width / 2,
        frontEaveHeight,
        -length / 2, // 7: right eave
        peakX,
        peakHeight,
        -length / 2, // 8: peak
        -width / 2,
        backEaveHeight,
        -length / 2, // 9: left eave
      ]);

      indices = [
        // Front Face
        0, 1, 2, 0, 2, 3, 0, 3, 4,

        // Back Face
        5, 7, 6, 5, 8, 7, 5, 9, 8,

        // Left Wall
        0, 4, 9, 0, 9, 5,

        // Right Wall
        1, 6, 7, 1, 7, 2,

        // Roof Left
        4, 3, 8, 4, 8, 9,

        // Roof Right
        2, 7, 8, 2, 8, 3,

        // Floor
        0, 5, 6, 0, 6, 1,
      ];
      break;
    }

    default:
      throw new Error(`Unsupported building shape: ${shape}`);
  }

  return { vertices, indices };
};

export const addBayLines = (spacing, wall, scene, buildingData) => {
  if (!spacing || spacing.length === 0) return;

  // Remove existing bay lines for this wall
  scene.children = scene.children.filter(
    (child) => !(child.isBayLine && child.wall === wall)
  );

  let position = 0;
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  const createLine = (start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(geometry, lineMaterial);
    line.isBayLine = true;
    line.wall = wall;
    scene.add(line);
  };

  const createRoofLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    line.isBayLine = true;
    line.wall = wall;
    scene.add(line);
  };

  spacing.forEach((bay, index) => {
    if (typeof bay !== 'number') {
      console.warn(`Invalid bay spacing value for ${wall}:`, bay);
      return;
    }

    if (index === 0) {
      position += bay;
      return;
    }

    const {
      shape,
      backPeakOffset,
      width,
      length,
      backEaveHeight,
      frontEaveHeight,
      backRoofPitch,
      frontRoofPitch,
    } = buildingData;

    let start, end, roofPoints;

    // Calculate height at any point along the width
    const calculateHeightAtPosition = (pos, isRightWall = false) => {
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
            const rightSideLength = width - backPeakOffset;
            const peakHeight =
              backEaveHeight + (backPeakOffset * backRoofPitch) / 12;
            return peakHeight - (distanceFromPeak * frontRoofPitch) / 12;
          }
        }
        default:
          return backEaveHeight;
      }
    };

    switch (wall) {
      case 'leftEndwall':
      case 'rightEndwall': {
        const xPos =
          wall === 'leftEndwall' ? -width / 2 + position : width / 2 - position;
        const zPos =
          wall === 'leftEndwall' ? length / 2 + 0.1 : -length / 2 - 0.1;

        const height = calculateHeightAtPosition(
          position,
          wall === 'rightEndwall'
        );

        start = new THREE.Vector3(xPos, 0, zPos);
        end = new THREE.Vector3(xPos, height, zPos);
        createLine(start, end);
        break;
      }

      case 'frontSidewall':
      case 'backSidewall': {
        const xOffset =
          wall === 'frontSidewall' ? width / 2 + 0.1 : -width / 2 - 0.1;
        const zPos =
          wall === 'frontSidewall'
            ? length / 2 - position
            : -length / 2 + position;

        start = new THREE.Vector3(xOffset, 0, zPos);
        end = new THREE.Vector3(
          xOffset,
          wall === 'frontSidewall' ? frontEaveHeight : backEaveHeight,
          zPos
        );
        createLine(start, end);

        // Roof line
        roofPoints = [];
        switch (shape) {
          case 'symmetrical':
            roofPoints = [
              new THREE.Vector3(-width / 2, backEaveHeight, zPos),
              new THREE.Vector3(
                0,
                ((width / 2) * backRoofPitch) / 12 + backEaveHeight,
                zPos
              ),
              new THREE.Vector3(width / 2, backEaveHeight, zPos),
            ];
            break;

          case 'singleSlope':
          case 'leanTo':
            roofPoints = [
              new THREE.Vector3(-width / 2, backEaveHeight, zPos),
              new THREE.Vector3(width / 2, frontEaveHeight, zPos),
            ];
            break;

          case 'nonSymmetrical': {
            const peakX = -width / 2 + backPeakOffset;
            const peakHeight = Math.max(
              (backPeakOffset * backRoofPitch) / 12 + backEaveHeight,
              ((width - backPeakOffset) * frontRoofPitch) / 12 + frontEaveHeight
            );
            roofPoints = [
              new THREE.Vector3(-width / 2, backEaveHeight, zPos),
              new THREE.Vector3(peakX, peakHeight, zPos),
              new THREE.Vector3(width / 2, frontEaveHeight, zPos),
            ];
            break;
          }
        }
        createRoofLine(roofPoints);
        break;
      }
    }

    position += bay;
  });
};

export const addBraceLines = (spacing, bracing, wall, scene, buildingData) => {
  // Remove existing brace lines
  scene.children = scene.children.filter(
    (child) => !(child.isBraceLine && child.wall === wall)
  );

  if (!spacing || spacing.length === 0 || !bracing || bracing.length === 0) {
    return;
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  const createBraceLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    line.isBraceLine = true;
    line.wall = wall;
    scene.add(line);
  };

  const {
    shape,
    backPeakOffset,
    width,
    length,
    frontEaveHeight,
    backEaveHeight,
    frontRoofPitch,
    backRoofPitch,
  } = buildingData;

  // Calculate height at any point along the width
  const calculateHeightAtPosition = (pos, isRightWall = false) => {
    // For right endwall, we need to measure from the right side
    const adjustedPos = pos;
    const effectiveBackPeakOffset = isRightWall
      ? width - backPeakOffset
      : backPeakOffset;

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
        if (
          (!isRightWall && adjustedPos <= effectiveBackPeakOffset) ||
          (isRightWall && adjustedPos >= effectiveBackPeakOffset)
        ) {
          // Left side of peak (or right side for right wall)
          if (isRightWall) {
            const distanceFromPeak = adjustedPos - effectiveBackPeakOffset;
            const peakHeight =
              backEaveHeight +
              ((width - effectiveBackPeakOffset) * backRoofPitch) / 12;
            return peakHeight - (distanceFromPeak * backRoofPitch) / 12; // Use backRoofPitch for right wall
          } else {
            return (adjustedPos * backRoofPitch) / 12 + backEaveHeight;
          }
        } else {
          // Right side of peak (or left side for right wall)
          if (isRightWall) {
            return (adjustedPos * frontRoofPitch) / 12 + frontEaveHeight;
          } else {
            const distanceFromPeak = adjustedPos - effectiveBackPeakOffset;
            const peakHeight =
              backEaveHeight + (effectiveBackPeakOffset * backRoofPitch) / 12;
            return peakHeight - (distanceFromPeak * frontRoofPitch) / 12; // Keep frontRoofPitch for left wall
          }
        }
      }
      default:
        return backEaveHeight;
    }
  };

  // Calculate bay positions
  const bayPositions = spacing.reduce((acc, bayWidth, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + spacing[index - 1]);
    return acc;
  }, []);

  bracing.forEach((bracedBayIndex) => {
    bracedBayIndex = bracedBayIndex - 1;
    if (bracedBayIndex < 0 || bracedBayIndex >= spacing.length) {
      console.warn(`Invalid braced bay index: ${bracedBayIndex}`);
      return;
    }

    const bayStart = bayPositions[bracedBayIndex];
    const bayEnd = bayStart + spacing[bracedBayIndex];

    switch (wall) {
      case 'leftEndwall':
      case 'rightEndwall': {
        const zOffset =
          wall === 'leftEndwall' ? length / 2 + 0.1 : -length / 2 - 0.1;
        const startX =
          wall === 'leftEndwall' ? -width / 2 + bayStart : width / 2 - bayStart;
        const endX =
          wall === 'leftEndwall' ? -width / 2 + bayEnd : width / 2 - bayEnd;

        // Calculate heights using corrected position logic
        const startHeight = calculateHeightAtPosition(
          bayStart,
          wall === 'rightEndwall'
        );
        const endHeight = calculateHeightAtPosition(
          bayEnd,
          wall === 'rightEndwall'
        );

        // Create X bracing
        createBraceLine([
          new THREE.Vector3(startX, 0, zOffset),
          new THREE.Vector3(endX, endHeight, zOffset),
        ]);
        createBraceLine([
          new THREE.Vector3(startX, startHeight, zOffset),
          new THREE.Vector3(endX, 0, zOffset),
        ]);
        break;
      }

      case 'frontSidewall':
      case 'backSidewall': {
        const xOffset =
          wall === 'frontSidewall' ? width / 2 + 0.1 : -width / 2 - 0.1;
        const zStart =
          wall === 'frontSidewall'
            ? length / 2 - bayStart
            : -length / 2 + bayStart;
        const zEnd =
          wall === 'frontSidewall' ? length / 2 - bayEnd : -length / 2 + bayEnd;
        const eaveHeight =
          wall === 'frontSidewall' ? frontEaveHeight : backEaveHeight;

        createBraceLine([
          new THREE.Vector3(xOffset, 0, zStart),
          new THREE.Vector3(xOffset, eaveHeight, zEnd),
        ]);
        createBraceLine([
          new THREE.Vector3(xOffset, eaveHeight, zStart),
          new THREE.Vector3(xOffset, 0, zEnd),
        ]);
        break;
      }

      case 'roof': {
        const zStart = length / 2 - bayStart;

        const zEnd = length / 2 - bayEnd;

        switch (shape) {
          case 'symmetrical': {
            const peakHeight =
              ((width / 2) * backRoofPitch) / 12 + backEaveHeight;
            createBraceLine([
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zStart),
              new THREE.Vector3(0, peakHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(0, peakHeight + 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, backEaveHeight + 0.1, zStart),
              new THREE.Vector3(0, peakHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(0, peakHeight + 0.1, zStart),
              new THREE.Vector3(width / 2, backEaveHeight + 0.1, zEnd),
            ]);
            break;
          }

          case 'singleSlope':
          case 'leanTo': {
            createBraceLine([
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zStart),
              new THREE.Vector3(width / 2, frontEaveHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, frontEaveHeight + 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zEnd),
            ]);
            break;
          }

          case 'nonSymmetrical': {
            const peakX = -width / 2 + backPeakOffset;
            const peakHeight = Math.max(
              (backPeakOffset * backRoofPitch) / 12 + backEaveHeight,
              ((width - backPeakOffset) * frontRoofPitch) / 12 + frontEaveHeight
            );

            createBraceLine([
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zStart),
              new THREE.Vector3(peakX, peakHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(peakX, peakHeight + 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, frontEaveHeight + 0.1, zStart),
              new THREE.Vector3(peakX, peakHeight + 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(peakX, peakHeight + 0.1, zStart),
              new THREE.Vector3(width / 2, frontEaveHeight + 0.1, zEnd),
            ]);
            break;
          }
        }
        break;
      }
    }
  });
};

export const addExtensions = (spacing, wall, scene, buildingData) => {
  // Remove existing brace lines
  scene.children = scene.children.filter(
    (child) => !(child.isExtensionLine && child.wall === wall)
  );

  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.7,
  });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const dashedMaterial = new THREE.LineDashedMaterial({
    color: 0x666666,
    linewidth: 1,
    scale: 2,
    dashSize: 2,
    gapSize: 1,
  });

  const createExtLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    const building = new THREE.Mesh(geometry, buildingMaterial);
    line.isExtensionLine = true;
    line.wall = wall;
    building.isExtensionLine = true;
    building.wall = wall;
    scene.add(line);
    scene.add(building);
  };

  const createColLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, dashedMaterial);
    line.computeLineDistances();
    line.isExtensionLine = true;
    line.wall = wall;
    scene.add(line);
  };

  const {
    shape,
    backPeakOffset,
    width,
    length,
    frontEaveHeight,
    backEaveHeight,
    frontRoofPitch,
    backRoofPitch,
    frontExtensionWidth,
    frontExtensionBays,
    backExtensionWidth,
    backExtensionBays,
    leftExtensionWidth,
    rightExtensionWidth,
    frontExtensionColumns,
    backExtensionColumns,
    frontBaySpacing,
    backBaySpacing,
  } = buildingData;

  // Calculate height at any point along the width
  const calculateHeightAtPosition = (pos, isRightWall = false) => {
    const getPitchExtension = (height, pitch) => {
      return (height * 12) / pitch;
    };

    // For right endwall, we need to measure from the right side
    const adjustedPos = pos;
    const effectiveBackPeakOffset = isRightWall
      ? width - backPeakOffset
      : backPeakOffset;

    switch (shape) {
      case 'symmetrical': {
        const centerPos = width / 2;
        const peakHeight = ((width / 2) * backRoofPitch) / 12 + backEaveHeight;

        if (pos <= 0) {
          // Left of building
          const extension = getPitchExtension(backEaveHeight, backRoofPitch);
          const distanceOutside = Math.abs(pos);
          return Math.max(
            0,
            backEaveHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else if (pos >= width) {
          // Right of building
          const extension = getPitchExtension(backEaveHeight, backRoofPitch);
          const distanceOutside = pos - width;
          return Math.max(
            0,
            backEaveHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else {
          // Inside building
          const distanceFromCenter = Math.abs(centerPos - pos);
          return (
            ((centerPos - distanceFromCenter) * backRoofPitch) / 12 +
            backEaveHeight
          );
        }
      }

      case 'singleSlope':
      case 'leanTo': {
        if (pos <= 0) {
          // Left of building
          const extension = getPitchExtension(backEaveHeight, backRoofPitch);
          const distanceOutside = Math.abs(pos);
          return Math.max(
            0,
            backEaveHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else if (pos >= width) {
          // Right of building
          const extension = getPitchExtension(frontEaveHeight, backRoofPitch);
          const distanceOutside = pos - width;
          return Math.max(
            0,
            frontEaveHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else {
          // Inside building
          return (pos * backRoofPitch) / 12 + backEaveHeight;
        }
      }

      case 'nonSymmetrical': {
        const peakX = -width / 2 + backPeakOffset;
        const peakHeight = Math.max(
          (backPeakOffset * backRoofPitch) / 12 + backEaveHeight,
          ((width - backPeakOffset) * frontRoofPitch) / 12 + frontEaveHeight
        );

        if (pos <= 0) {
          // Left of building
          const extension = getPitchExtension(backEaveHeight, backRoofPitch);
          const distanceOutside = Math.abs(pos);
          return Math.max(
            0,
            backEaveHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else if (pos >= width) {
          // Right of building
          const extension = getPitchExtension(frontEaveHeight, frontRoofPitch);
          const distanceOutside = pos - width;
          return Math.max(
            0,
            frontEaveHeight - (distanceOutside * frontRoofPitch) / 12
          );
        } else if (pos <= backPeakOffset) {
          // Left side of peak
          return (pos * backRoofPitch) / 12 + backEaveHeight;
        } else {
          // Right side of peak
          const distanceFromPeak = pos - backPeakOffset;
          return peakHeight - (distanceFromPeak * frontRoofPitch) / 12;
        }
      }

      default:
        return backEaveHeight;
    }
  };

  let bays = [];
  let extWidth = 0;

  switch (wall) {
    case 'frontSidewall':
      bays = frontExtensionBays;
      extWidth = frontExtensionWidth;
      break;
    case 'backSidewall':
      bays = backExtensionBays;
      extWidth = backExtensionWidth;
      break;
    case 'leftEndwall': {
      extWidth = leftExtensionWidth;
      const frontFirstBay = frontExtensionBays.includes(1);
      const backLastBay = backExtensionBays.includes(backBaySpacing.length);
      const frontWidth = frontFirstBay ? frontExtensionWidth : 0;
      const backWidth = backLastBay ? backExtensionWidth : 0;
      // Create Front Left Gable
      createExtLine([
        new THREE.Vector3(width / 2 + frontWidth, frontEaveHeight, length / 2),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2 + extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2 + extWidth
        ),
        new THREE.Vector3(
          width / 2 + frontWidth,
          frontEaveHeight,
          length / 2 + extWidth
        ),
        new THREE.Vector3(width / 2 + frontWidth, frontEaveHeight, length / 2),
      ]);
      // Create Back Left Gable
      createExtLine([
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2
        ),
        new THREE.Vector3(-width / 2 - backWidth, backEaveHeight, length / 2),
        new THREE.Vector3(
          -width / 2 - backWidth,
          backEaveHeight,
          length / 2 + extWidth
        ),
        new THREE.Vector3(
          -width / 2 - backWidth,
          backEaveHeight,
          length / 2 + extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2 + extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          length / 2
        ),
      ]);
      break;
    }
    case 'rightEndwall': {
      extWidth = rightExtensionWidth;
      const frontLastBay = frontExtensionBays.includes(frontBaySpacing.length);
      const backFirstBay = backExtensionBays.includes(1);
      const frontWidth = frontLastBay ? frontExtensionWidth : 0;
      const backWidth = backFirstBay ? backExtensionWidth : 0;
      // Create Front Right Gable
      createExtLine([
        new THREE.Vector3(width / 2 + frontWidth, frontEaveHeight, -length / 2),
        new THREE.Vector3(
          width / 2 + frontWidth,
          frontEaveHeight,
          -length / 2 - extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2 - extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2 - extWidth
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2
        ),
        new THREE.Vector3(width / 2 + frontWidth, frontEaveHeight, -length / 2),
      ]);
      // Create Back Right Gable
      createExtLine([
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2
        ),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2 - extWidth
        ),
        new THREE.Vector3(
          -width / 2 - backWidth,
          backEaveHeight,
          -length / 2 - extWidth
        ),
        new THREE.Vector3(
          -width / 2 - backWidth,
          backEaveHeight,
          -length / 2 - extWidth
        ),
        new THREE.Vector3(-width / 2 - backWidth, backEaveHeight, -length / 2),
        new THREE.Vector3(
          -width / 2 + backPeakOffset,
          calculateHeightAtPosition(backPeakOffset),
          -length / 2
        ),
      ]);
      break;
    }
    default:
      bays = frontExtensionBays;
      extWidth = frontExtensionWidth;
      break;
  }

  // Calculate bay positions
  const bayPositions = spacing.reduce((acc, bayWidth, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + spacing[index - 1]);
    return acc;
  }, []);

  bays.forEach((bayIndex) => {
    bayIndex = bayIndex - 1;
    if (bayIndex < 0 || bayIndex >= spacing.length) {
      console.warn(`Invalid braced bay index: ${bayIndex}`);
      return;
    }

    const bayStart = bayPositions[bayIndex];
    const bayEnd = bayStart + spacing[bayIndex];

    const xOffset =
      wall === 'frontSidewall' ? width / 2 + 0.1 : -width / 2 - 0.1;
    const zStart =
      wall === 'frontSidewall' ? length / 2 - bayStart : -length / 2 + bayStart;
    const zEnd =
      wall === 'frontSidewall' ? length / 2 - bayEnd : -length / 2 + bayEnd;
    const eaveHeight =
      wall === 'frontSidewall' ? frontEaveHeight : backEaveHeight;
    const extHeight =
      wall === 'frontSidewall'
        ? calculateHeightAtPosition(width + extWidth)
        : calculateHeightAtPosition(0 - extWidth);

    createExtLine([
      new THREE.Vector3(xOffset, eaveHeight, zStart),
      new THREE.Vector3(
        wall === 'frontSidewall' ? xOffset + extWidth : xOffset - extWidth,
        extHeight,
        zStart
      ),
      new THREE.Vector3(
        wall === 'frontSidewall' ? xOffset + extWidth : xOffset - extWidth,
        extHeight,
        zEnd
      ),
      new THREE.Vector3(
        wall === 'frontSidewall' ? xOffset + extWidth : xOffset - extWidth,
        extHeight,
        zEnd
      ),
      new THREE.Vector3(xOffset, eaveHeight, zEnd),
      new THREE.Vector3(xOffset, eaveHeight, zStart),
    ]);

    if (wall === 'frontSidewall' && frontExtensionColumns) {
      createColLine([
        new THREE.Vector3(xOffset + extWidth, extHeight, zStart),
        new THREE.Vector3(xOffset + extWidth, 0, zStart),
      ]);
      createColLine([
        new THREE.Vector3(xOffset + extWidth, extHeight, zEnd),
        new THREE.Vector3(xOffset + extWidth, 0, zEnd),
      ]);
    }
    if (wall === 'backSidewall' && backExtensionColumns) {
      createColLine([
        new THREE.Vector3(xOffset - extWidth, extHeight, zStart),
        new THREE.Vector3(xOffset - extWidth, 0, zStart),
      ]);
      createColLine([
        new THREE.Vector3(xOffset - extWidth, extHeight, zEnd),
        new THREE.Vector3(xOffset - extWidth, 0, zEnd),
      ]);
    }
  });
};
