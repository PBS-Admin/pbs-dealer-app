import * as THREE from 'three';

// Calculate building vertices and indices for 3D geometry
export const calculateBuildingGeometry = (buildingData) => {
  const { shape } = buildingData;

  // Get points for each wall
  const { wallPoints: leftPoints } = getWallPoints(buildingData, 'left');
  const { wallPoints: rightPoints } = getWallPoints(buildingData, 'right');
  const { wallPoints: frontPoints } = getWallPoints(buildingData, 'front');
  const { wallPoints: backPoints } = getWallPoints(buildingData, 'back');

  // Initialize arrays for final vertices
  let vertices = [];
  let indices = [];
  let vertexIndex = 0;

  // Helper function to add triangles from wall points
  const addWallTriangles = (points, zPos, reverseIndices = false) => {
    // Add vertices
    const wallVertices = points.flatMap((p) => [p.x, p.y, zPos]);
    vertices.push(...wallVertices);

    // Add triangles
    const startIdx = vertexIndex;
    for (let i = 1; i < points.length - 1; i++) {
      if (reverseIndices) {
        indices.push(startIdx, startIdx + i + 1, startIdx + i);
      } else {
        indices.push(startIdx, startIdx + i, startIdx + i + 1);
      }
    }
    vertexIndex += points.length;
  };

  // Add each wall based on building shape
  switch (shape) {
    case 'symmetrical': {
      // Left Endwall (front)
      addWallTriangles(leftPoints, buildingData.length / 2);

      // Right Endwall (back)
      addWallTriangles(rightPoints, -buildingData.length / 2, true);

      // Front Wall
      addWallTriangles(frontPoints, 0);

      // Back Wall
      addWallTriangles(backPoints, 0, true);

      // Roof triangles - using the upper points from walls
      const roofStartIdx = vertexIndex;

      // Add roof vertices
      const roofVertices = [
        // Left side roof vertices
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        buildingData.length / 2,
        0,
        calculateHeightAtPosition(buildingData, buildingData.width / 2),
        buildingData.length / 2,
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        -buildingData.length / 2,
        0,
        calculateHeightAtPosition(buildingData, buildingData.width / 2),
        -buildingData.length / 2,

        // Right side roof vertices
        buildingData.width / 2,
        buildingData.backEaveHeight,
        buildingData.length / 2,
        buildingData.width / 2,
        buildingData.backEaveHeight,
        -buildingData.length / 2,
      ];

      vertices.push(...roofVertices);

      // Add roof triangles
      indices.push(
        // Left roof panel
        roofStartIdx,
        roofStartIdx + 1,
        roofStartIdx + 2,
        roofStartIdx + 1,
        roofStartIdx + 3,
        roofStartIdx + 2,

        // Right roof panel
        roofStartIdx + 1,
        roofStartIdx + 4,
        roofStartIdx + 5,
        roofStartIdx + 1,
        roofStartIdx + 5,
        roofStartIdx + 3
      );

      vertexIndex += 6; // Added 6 roof vertices
      break;
    }

    case 'singleSlope':
    case 'leanTo': {
      // Front face
      addWallTriangles(frontPoints, buildingData.length / 2);

      // Back face
      addWallTriangles(backPoints, -buildingData.length / 2, true);

      // Left wall
      addWallTriangles(leftPoints, 0);

      // Right wall
      addWallTriangles(rightPoints, 0, true);

      // Roof - single slope
      const roofStartIdx = vertexIndex;

      // Add roof vertices - using existing eave heights
      const roofVertices = [
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        buildingData.length / 2,
        buildingData.width / 2,
        buildingData.frontEaveHeight,
        buildingData.length / 2,
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        -buildingData.length / 2,
        buildingData.width / 2,
        buildingData.frontEaveHeight,
        -buildingData.length / 2,
      ];

      vertices.push(...roofVertices);

      // Add roof triangles
      indices.push(
        roofStartIdx,
        roofStartIdx + 1,
        roofStartIdx + 2,
        roofStartIdx + 1,
        roofStartIdx + 3,
        roofStartIdx + 2
      );

      vertexIndex += 4;
      break;
    }

    case 'nonSymmetrical': {
      // Similar structure to symmetrical but with adjusted peak position
      const peakX = -buildingData.width / 2 + buildingData.backPeakOffset;
      const peakHeight = calculateHeightAtPosition(
        buildingData,
        buildingData.backPeakOffset
      );

      // Add all walls
      addWallTriangles(leftPoints, buildingData.length / 2);
      addWallTriangles(rightPoints, -buildingData.length / 2, true);
      addWallTriangles(frontPoints, 0);
      addWallTriangles(backPoints, 0, true);

      // Add roof vertices
      const roofStartIdx = vertexIndex;
      const roofVertices = [
        // Left side roof vertices
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        buildingData.length / 2,
        peakX,
        peakHeight,
        buildingData.length / 2,
        -buildingData.width / 2,
        buildingData.backEaveHeight,
        -buildingData.length / 2,
        peakX,
        peakHeight,
        -buildingData.length / 2,

        // Right side roof vertices
        buildingData.width / 2,
        buildingData.frontEaveHeight,
        buildingData.length / 2,
        buildingData.width / 2,
        buildingData.frontEaveHeight,
        -buildingData.length / 2,
      ];

      vertices.push(...roofVertices);

      // Add roof triangles
      indices.push(
        // Left roof panel
        roofStartIdx,
        roofStartIdx + 1,
        roofStartIdx + 2,
        roofStartIdx + 1,
        roofStartIdx + 3,
        roofStartIdx + 2,

        // Right roof panel
        roofStartIdx + 1,
        roofStartIdx + 4,
        roofStartIdx + 5,
        roofStartIdx + 1,
        roofStartIdx + 5,
        roofStartIdx + 3
      );

      vertexIndex += 6;
      break;
    }

    default:
      throw new Error(`Unsupported building shape: ${shape}`);
  }

  return {
    vertices: new Float32Array(vertices),
    indices: indices,
  };
};

// Common utility to calculate height at any position
export const calculateHeightAtPosition = (
  building,
  pos,
  isRightWall = false
) => {
  const {
    shape,
    backPeakOffset,
    width,
    backEaveHeight,
    frontEaveHeight,
    backRoofPitch,
    frontRoofPitch,
  } = building;

  const adjustedPos = isRightWall ? width - pos : pos;

  switch (shape) {
    case 'symmetrical': {
      const peakHeight = backEaveHeight + (width / 2) * (backRoofPitch / 12);
      const distanceFromCenter = Math.abs(-width / 2 + adjustedPos);
      return peakHeight - (distanceFromCenter * backRoofPitch) / 12;
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

// Common utility to calculate height at any position
export const calculatePosAtHeight = (building, pHeight) => {
  const {
    shape,
    backPeakOffset,
    width,
    backEaveHeight,
    frontEaveHeight,
    backRoofPitch,
    frontRoofPitch,
  } = building;

  if (pHeight == 0) return [0, width];

  switch (shape) {
    case 'symmetrical': {
      let distanceFromPeak = 0;
      const peakHeight = backEaveHeight + (width / 2) * (backRoofPitch / 12);
      if (pHeight < peakHeight && pHeight != 0) {
        distanceFromPeak = ((peakHeight - pHeight) * 12) / (backRoofPitch / 12);
      }
      // const distanceFromCenter = Math.abs(-width / 2 + adjustedPos);
      return [
        backPeakOffset - distanceFromPeak,
        backPeakOffset + distanceFromPeak,
      ];
    }
    case 'singleSlope':
    case 'leanTo': {
      let distanceFromPeak = 0;
      if (pHeight < frontEaveHeight && pHeight != 0) {
        distanceFromPeak =
          ((frontEaveHeight - pHeight) * 12) / (frontRoofPitch / 12);
      }
      return [0, width];
    }
    case 'nonSymmetrical': {
      let startFromPeak = 0;
      let startPos = 0;
      let endFromPeak = 0;
      let endPos = 0;
      const peakHeight = backEaveHeight + (backPeakOffset * backRoofPitch) / 12;

      if (pHeight < peakHeight && pHeight != 0) {
        if (pHeight > backEaveHeight) {
          startFromPeak = (peakHeight - pHeight) / (backRoofPitch / 12);
        } else {
          startFromPeak = backPeakOffset;
        }

        if (pHeight > frontEaveHeight) {
          endFromPeak = (peakHeight - pHeight) / (frontRoofPitch / 12);
        } else {
          endFromPeak = width - backPeakOffset;
        }
      }
      return [backPeakOffset - startFromPeak, backPeakOffset + endFromPeak];
    }
    default:
      return backEaveHeight;
  }
};

// Get wall points for any wall type
export const getWallPoints = (building, wallType) => {
  const normalizedWallType = wallType.toLowerCase();
  let wallWidth;
  let wallPoints = [0];

  if (normalizedWallType === 'front' || normalizedWallType === 'back') {
    wallWidth = building.length;
    const eaveHeight =
      normalizedWallType === 'front'
        ? building.frontEaveHeight
        : building.backEaveHeight;

    wallPoints = [
      new THREE.Vector2(wallWidth / 2, eaveHeight), // Top right
      new THREE.Vector2(-wallWidth / 2, eaveHeight), // Top left
      new THREE.Vector2(-wallWidth / 2, 0), // Bottom left
      new THREE.Vector2(wallWidth / 2, 0), // Bottom right
      new THREE.Vector2(wallWidth / 2, eaveHeight), // Top right
      new THREE.Vector2(wallWidth / 2, eaveHeight), // Roof right
      new THREE.Vector2(-wallWidth / 2, eaveHeight), // Roof left
      new THREE.Vector2(-wallWidth / 2, eaveHeight), // Top left
    ];
  } else if (normalizedWallType === 'left' || normalizedWallType === 'right') {
    wallWidth = building.width;
    const isRightWall = normalizedWallType === 'right';

    wallPoints = [
      new THREE.Vector2(-wallWidth / 2, 0), // Bottom left
      new THREE.Vector2(wallWidth / 2, 0), // Bottom right
    ];

    if (building.shape === 'symmetrical') {
      wallPoints.push(
        new THREE.Vector2(wallWidth / 2, building.backEaveHeight),
        new THREE.Vector2(
          0,
          calculateHeightAtPosition(building, wallWidth / 2, isRightWall)
        ),
        new THREE.Vector2(-wallWidth / 2, building.backEaveHeight)
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
      const peakX = isRightWall
        ? wallWidth / 2 - peakPosition
        : -wallWidth / 2 + peakPosition;
      const peakHeight = calculateHeightAtPosition(
        building,
        peakPosition,
        isRightWall
      );

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
  }

  return { wallWidth, wallPoints };
};

// Create wall outline with specified material
export const createWallOutline = (
  wallPoints,
  material = new THREE.LineBasicMaterial({ color: 0x000000 })
) => {
  const shape = new THREE.Shape(wallPoints);
  const geometry = new THREE.BufferGeometry().setFromPoints(shape.getPoints());
  return new THREE.LineLoop(geometry, material);
};

// Add bay lines for any wall type
export const addWallBayLines = (
  scene,
  building,
  wallType,
  material = new THREE.LineBasicMaterial({ color: 0x666666 })
) => {
  const { wallWidth, wallPoints } = getWallPoints(building, wallType);
  const normalizedWallType = wallType.toLowerCase();
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
        const height = calculateHeightAtPosition(
          building,
          currentPos,
          isRightWall
        );

        linePoints = [
          new THREE.Vector2(currentPos - wallWidth / 2, 0),
          new THREE.Vector2(currentPos - wallWidth / 2, height),
        ];
      } else if (['front', 'back'].includes(normalizedWallType)) {
        linePoints = [
          new THREE.Vector2(currentPos - wallWidth / 2, 0),
          new THREE.Vector2(
            currentPos - wallWidth / 2,
            calculateHeightAtPosition(building, building.backPeakOffset)
          ),
        ];
      }

      lineGeometry.setFromPoints(linePoints);
      const line = new THREE.Line(lineGeometry, material);
      scene.add(line);

      currentPos += space;
    });
  }
};

// Setup camera for wall view
export const setupWallCamera = (
  width,
  height,
  wallWidth,
  maxHeight,
  padding = 20
) => {
  const viewWidth = wallWidth + padding * 2;
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
  return camera;
};

export const createBuilding = (buildingData, isFlat) => {
  const { width, length } = buildingData;

  // Get points for each wall
  const { wallPoints: leftPoints } = getWallPoints(buildingData, 'left');
  const { wallPoints: rightPoints } = getWallPoints(buildingData, 'right');
  const { wallPoints: frontPoints } = getWallPoints(buildingData, 'front');
  const { wallPoints: backPoints } = getWallPoints(buildingData, 'back');

  // Create separate geometries for building and roof
  const buildingGeometry = new THREE.BufferGeometry();
  const roofGeometry = new THREE.BufferGeometry();

  // Building vertices and indices
  const buildingVertices = [];
  const buildingIndices = [];
  let buildingVertexIndex = 0;

  // Helper function to add wall vertices and triangles
  const addWall = (points, transform) => {
    const wallVertices = points
      .map((p) => {
        const transformed = transform(p);
        return [transformed.x, transformed.y, transformed.z];
      })
      .flat();

    buildingVertices.push(...wallVertices);

    // Add triangles for the wall
    for (let i = 1; i < points.length - 1; i++) {
      buildingIndices.push(
        buildingVertexIndex,
        buildingVertexIndex + i,
        buildingVertexIndex + i + 1
      );
    }

    buildingVertexIndex += points.length;
  };

  // Add walls to building geometry
  addWall(leftPoints, (p) => ({
    x: p.x,
    y: p.y,
    z: length / 2,
  }));

  addWall(rightPoints.toReversed(), (p) => ({
    x: p.x,
    y: p.y,
    z: -length / 2,
  }));

  addWall(frontPoints, (p) => ({
    x: width / 2,
    y: p.y,
    z: -p.x,
  }));

  addWall(backPoints.toReversed(), (p) => ({
    x: -width / 2,
    y: p.y,
    z: -p.x,
  }));

  // Set up building geometry
  buildingGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(buildingVertices, 3)
  );
  buildingGeometry.setIndex(buildingIndices);
  buildingGeometry.computeVertexNormals();

  // Create roof geometry based on building shape
  const roofVertices = [];
  const roofIndices = [];
  let roofVertexIndex = 0;

  switch (buildingData.shape) {
    case 'symmetrical': {
      const peakHeight = calculateHeightAtPosition(buildingData, width / 2);

      // Add roof vertices
      roofVertices.push(
        // Left panel
        -width / 2,
        buildingData.backEaveHeight,
        length / 2,
        0,
        peakHeight,
        length / 2,
        -width / 2,
        buildingData.backEaveHeight,
        -length / 2,
        0,
        peakHeight,
        -length / 2,

        // Right panel
        width / 2,
        buildingData.backEaveHeight,
        length / 2,
        width / 2,
        buildingData.backEaveHeight,
        -length / 2
      );

      roofIndices.push(
        0,
        1,
        2, // Left panel triangle 1
        1,
        3,
        2, // Left panel triangle 2
        1,
        4,
        5, // Right panel triangle 1
        1,
        5,
        3 // Right panel triangle 2
      );
      break;
    }

    case 'singleSlope':
    case 'leanTo': {
      roofVertices.push(
        -width / 2,
        buildingData.backEaveHeight,
        length / 2,
        width / 2,
        buildingData.frontEaveHeight,
        length / 2,
        -width / 2,
        buildingData.backEaveHeight,
        -length / 2,
        width / 2,
        buildingData.frontEaveHeight,
        -length / 2
      );

      roofIndices.push(0, 1, 2, 1, 3, 2);
      break;
    }

    case 'nonSymmetrical': {
      const peakX = -width / 2 + buildingData.backPeakOffset;
      const peakHeight = calculateHeightAtPosition(
        buildingData,
        buildingData.backPeakOffset
      );

      roofVertices.push(
        // Left panel
        -width / 2,
        buildingData.backEaveHeight,
        length / 2,
        peakX,
        peakHeight,
        length / 2,
        -width / 2,
        buildingData.backEaveHeight,
        -length / 2,
        peakX,
        peakHeight,
        -length / 2,

        // Right panel
        width / 2,
        buildingData.frontEaveHeight,
        length / 2,
        width / 2,
        buildingData.frontEaveHeight,
        -length / 2
      );

      roofIndices.push(
        0,
        1,
        2, // Left panel triangle 1
        1,
        3,
        2, // Left panel triangle 2
        1,
        4,
        5, // Right panel triangle 1
        1,
        5,
        3 // Right panel triangle 2
      );
      break;
    }
  }

  // Set up roof geometry
  roofGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(roofVertices, 3)
  );
  roofGeometry.setIndex(roofIndices);
  roofGeometry.computeVertexNormals();

  // Create materials
  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: isFlat ? 0.9 : 0.4,
  });

  const roofMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: isFlat ? 0.9 : 0.4,
  });

  // Create meshes
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);

  // Create line materials
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  // Create line geometries
  const buildingEdges = new THREE.EdgesGeometry(buildingGeometry);
  const roofEdges = new THREE.EdgesGeometry(roofGeometry);

  // Create line meshes
  const buildingLines = new THREE.LineSegments(buildingEdges, edgesMaterial);
  const roofLines = new THREE.LineSegments(roofEdges, edgesMaterial);

  // Set names
  building.name = 'building';
  roof.name = 'roof';
  buildingLines.name = 'buildingLines';
  roofLines.name = 'roofLines';

  return { building, roof, buildingLines, roofLines };
};

// export const addPartition = (wall, scene, buildingData) => {
//   // Remove existing partitions
//   scene.children = scene.children.filter(
//     (child) => !(child.isPartitionLine && child.wall === wall)
//   );

//   const {
//     shape,
//     backPeakOffset,
//     width,
//     length,
//     partitions,
//     frontEaveHeight,
//     backEaveHeight,
//     frontRoofPitch,
//     backRoofPitch,
//     frontExtensionWidth,
//     frontExtensionBays,
//     backExtensionWidth,
//     backExtensionBays,
//     leftExtensionWidth,
//     rightExtensionWidth,
//     frontExtensionColumns,
//     backExtensionColumns,
//     frontBaySpacing,
//     backBaySpacing,
//   } = buildingData;

//   const buildingMaterial = new THREE.MeshBasicMaterial({
//     color: 0xcccccc,
//     transparent: true,
//     opacity: 0.4,
//   });

//   const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
//   const dashedMaterial = new THREE.LineDashedMaterial({
//     color: 0x666666,
//     linewidth: 1,
//     scale: 2,
//     dashSize: 2,
//     gapSize: 1,
//   });

//   const createPartLine = (points) => {
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const line = new THREE.Line(geometry, lineMaterial);
//     const building = new THREE.Mesh(geometry, buildingMaterial);
//     line.isPartitionLine = true;
//     line.wall = wall;
//     building.isPartitionLine = true;
//     building.wall = wall;
//     line.name = 'partitionLines';
//     building.name = 'partitions';
//     scene.add(line);
//     // scene.add(building);
//   };

//   const pIndex = parseInt(wall.replace('partition', ''));
//   const part = partitions[pIndex - 1];

//   if (part.orientation == 'l') {
//     // createPartLine([
//     //   new THREE.Vector3(
//     //     -width / 2,
//     //     calculateHeightAtPosition(-width / 2),
//     //     length / 2
//     //   ),
//     //   new THREE.Vector3(
//     //     -width / 2,
//     //     calculateHeightAtPosition(-width / 2),
//     //     length / 2
//     //   ),
//     //   new THREE.Vector3(
//     //     width / 2,
//     //     calculateHeightAtPosition(width / 2),
//     //     length / 2
//     //   ),
//     //   new THREE.Vector3(
//     //     width / 2,
//     //     calculateHeightAtPosition(width / 2),
//     //     length / 2
//     //   ),
//     //   new THREE.Vector3(
//     //     width / 2,
//     //     calculateHeightAtPosition(width / 2),
//     //     length / 2
//     //   ),
//     //   new THREE.Vector3(
//     //     -width / 2,
//     //     calculateHeightAtPosition(-width / 2),
//     //     length / 2
//     //   ),
//     // ]);
//     createPartLine([
//       new THREE.Vector3(-40, 18, 60),
//       new THREE.Vector3(-40, 18, 60),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         -width / 2,
//         calculateHeightAtPosition(-width / 2),
//         length / 2
//       ),
//     ]);
//   } else {
//     createPartLine([
//       new THREE.Vector3(
//         -width / 2,
//         calculateHeightAtPosition(-width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         -width / 2,
//         calculateHeightAtPosition(-width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         width / 2,
//         calculateHeightAtPosition(width / 2),
//         length / 2
//       ),
//       new THREE.Vector3(
//         -width / 2,
//         calculateHeightAtPosition(-width / 2),
//         length / 2
//       ),
//     ]);
//   }
// };

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
    line.name = 'bayLines';
    scene.add(line);
  };

  const createRoofLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    line.isBayLine = true;
    line.wall = wall;
    line.name = 'roofLines';
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
    line.name = 'braceLines';
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

  // // Calculate height at any point along the width
  // const calculateHeightAtPosition = (pos, isRightWall = false) => {
  //   // For right endwall, we need to measure from the right side
  //   const adjustedPos = pos;
  //   const effectiveBackPeakOffset = isRightWall
  //     ? width - backPeakOffset
  //     : backPeakOffset;

  //   switch (shape) {
  //     case 'symmetrical': {
  //       const distanceFromCenter = Math.abs(width / 2 - adjustedPos);
  //       return (
  //         ((width / 2 - distanceFromCenter) * backRoofPitch) / 12 +
  //         backEaveHeight
  //       );
  //     }
  //     case 'singleSlope':
  //     case 'leanTo': {
  //       return (adjustedPos * backRoofPitch) / 12 + backEaveHeight;
  //     }
  //     case 'nonSymmetrical': {
  //       if (
  //         (!isRightWall && adjustedPos <= effectiveBackPeakOffset) ||
  //         (isRightWall && adjustedPos >= effectiveBackPeakOffset)
  //       ) {
  //         // Left side of peak (or right side for right wall)
  //         if (isRightWall) {
  //           const distanceFromPeak = adjustedPos - effectiveBackPeakOffset;
  //           const peakHeight =
  //             backEaveHeight +
  //             ((width - effectiveBackPeakOffset) * backRoofPitch) / 12;
  //           return peakHeight - (distanceFromPeak * backRoofPitch) / 12; // Use backRoofPitch for right wall
  //         } else {
  //           return (adjustedPos * backRoofPitch) / 12 + backEaveHeight;
  //         }
  //       } else {
  //         // Right side of peak (or left side for right wall)
  //         if (isRightWall) {
  //           return (adjustedPos * frontRoofPitch) / 12 + frontEaveHeight;
  //         } else {
  //           const distanceFromPeak = adjustedPos - effectiveBackPeakOffset;
  //           const peakHeight =
  //             backEaveHeight + (effectiveBackPeakOffset * backRoofPitch) / 12;
  //           return peakHeight - (distanceFromPeak * frontRoofPitch) / 12; // Keep frontRoofPitch for left wall
  //         }
  //       }
  //     }
  //     default:
  //       return backEaveHeight;
  //   }
  // };

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
          wall === 'leftEndwall' ? length / 2 - 0.1 : -length / 2 + 0.1;
        const startX =
          wall === 'leftEndwall' ? -width / 2 + bayStart : width / 2 - bayStart;
        const endX =
          wall === 'leftEndwall' ? -width / 2 + bayEnd : width / 2 - bayEnd;

        // Calculate heights using corrected position logic
        const startHeight = calculateHeightAtPosition(
          buildingData,
          bayStart,
          wall === 'rightEndwall'
        );
        const endHeight = calculateHeightAtPosition(
          buildingData,
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
          wall === 'frontSidewall' ? width / 2 - 0.1 : -width / 2 + 0.1;
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
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zStart),
              new THREE.Vector3(0, peakHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(0, peakHeight - 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, backEaveHeight - 0.1, zStart),
              new THREE.Vector3(0, peakHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(0, peakHeight - 0.1, zStart),
              new THREE.Vector3(width / 2, backEaveHeight - 0.1, zEnd),
            ]);
            break;
          }

          case 'singleSlope':
          case 'leanTo': {
            createBraceLine([
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zStart),
              new THREE.Vector3(width / 2, frontEaveHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, frontEaveHeight - 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zEnd),
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
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zStart),
              new THREE.Vector3(peakX, peakHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(peakX, peakHeight - 0.1, zStart),
              new THREE.Vector3(-width / 2, backEaveHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(width / 2, frontEaveHeight - 0.1, zStart),
              new THREE.Vector3(peakX, peakHeight - 0.1, zEnd),
            ]);
            createBraceLine([
              new THREE.Vector3(peakX, peakHeight - 0.1, zStart),
              new THREE.Vector3(width / 2, frontEaveHeight - 0.1, zEnd),
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
    opacity: 0.4,
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
    line.name = 'extensionLines';
    building.name = 'extensions';
    scene.add(line);
    scene.add(building);
  };

  const createColLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, dashedMaterial);
    line.computeLineDistances();
    line.isExtensionLine = true;
    line.wall = wall;
    line.name = 'extensionLines';
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
        const centerPos = 0;
        const peakHeight = ((width / 2) * backRoofPitch) / 12 + backEaveHeight;
        const distanceFromCenter = Math.abs(centerPos - pos);
        return peakHeight - (distanceFromCenter * backRoofPitch) / 12;
      }

      case 'singleSlope':
      case 'leanTo': {
        const midHeight = backEaveHeight + ((width / 2) * backRoofPitch) / 12;
        const distanceOutside = Math.abs(pos);
        if (pos <= 0) {
          // Left of building
          return Math.max(
            0,
            midHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else {
          // Inside building
          return Math.max(
            0,
            midHeight + (distanceOutside * backRoofPitch) / 12
          );
        }
      }

      case 'nonSymmetrical': {
        const peakHeight = Math.max(
          (backPeakOffset * backRoofPitch) / 12 + backEaveHeight,
          ((width - backPeakOffset) * frontRoofPitch) / 12 + frontEaveHeight
        );

        if (pos <= -width / 2 + backPeakOffset) {
          // Back of Building
          const distanceOutside = Math.abs(pos - (-width / 2 + backPeakOffset));
          return Math.max(
            0,
            peakHeight - (distanceOutside * backRoofPitch) / 12
          );
        } else if (pos > -width / 2 + backPeakOffset) {
          // Right of building
          // const distanceOutside = pos + width;
          const distanceOutside = Math.abs(pos - (-width / 2 + backPeakOffset));
          return Math.max(
            0,
            peakHeight - (distanceOutside * frontRoofPitch) / 12
          );
        }
      }
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
      // Gable for Single Slope
      if (shape == 'leanTo' || shape == 'singleSlope') {
        createExtLine([
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2
          ),
        ]);
      } else {
        // Gable for other shapes
        // Create Front Left Gable
        createExtLine([
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            length / 2
          ),
        ]);
        // Create Back Left Gable
        createExtLine([
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2 + extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            length / 2
          ),
        ]);
      }
      break;
    }
    case 'rightEndwall': {
      extWidth = rightExtensionWidth;
      const frontLastBay = frontExtensionBays.includes(frontBaySpacing.length);
      const backFirstBay = backExtensionBays.includes(1);
      const frontWidth = frontLastBay ? frontExtensionWidth : 0;
      const backWidth = backFirstBay ? backExtensionWidth : 0;
      // Gable for Single Slope
      if (shape == 'leanTo' || shape == 'singleSlope') {
        createExtLine([
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2
          ),
        ]);
      } else {
        // Gable for other shapes
        // Create Front Right Gable
        createExtLine([
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2
          ),
          new THREE.Vector3(
            width / 2 + frontWidth,
            calculateHeightAtPosition(width / 2 + frontWidth),
            -length / 2
          ),
        ]);
        // Create Back Right Gable
        createExtLine([
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2 - extWidth
          ),
          new THREE.Vector3(
            -width / 2 - backWidth,
            calculateHeightAtPosition(-width / 2 - backWidth),
            -length / 2
          ),
          new THREE.Vector3(
            -width / 2 + backPeakOffset,
            calculateHeightAtPosition(-width / 2 + backPeakOffset),
            -length / 2
          ),
        ]);
      }

      break;
    }
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
        ? calculateHeightAtPosition(width / 2 + extWidth)
        : calculateHeightAtPosition(-width / 2 - extWidth);

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

export const addOpenings = (scene, buildingData) => {
  // Remove existing brace lines
  scene.children = scene.children.filter((child) => !child.isOpening);

  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
  });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const errorMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const dashedMaterial = new THREE.LineDashedMaterial({
    color: 0x666666,
    linewidth: 1,
    scale: 2,
    dashSize: 2,
    gapSize: 1,
  });

  const createExtLine = (points, material = lineMaterial) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    const building = new THREE.Mesh(geometry, buildingMaterial);
    line.isOpening = true;
    building.isOpening = true;
    line.name = 'openings';
    building.name = 'openings';
    scene.add(line);
    scene.add(building);
  };

  // Calculate the cumulative spacing before a given bay
  const getSpacingBeforeBay = (spacingArray, bayNumber) => {
    // If bay is 0 or 1, return 0 as there's no spacing before it
    if (bayNumber <= 1) return 0;

    const spacesBeforeBay = spacingArray.slice(0, bayNumber - 1);

    // Sum up all the spaces
    return spacesBeforeBay.reduce((sum, space) => sum + space, 0);
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
    leftBaySpacing,
    rightBaySpacing,
    openings,
  } = buildingData;

  Object.entries(openings).forEach(([side, sideOpenings]) => {
    // Check if openings array exists and has items
    if (Array.isArray(sideOpenings) && sideOpenings.length > 0) {
      sideOpenings.forEach((opening) => {
        // Check if opening has valid properties
        if (opening.bay && opening.width && opening.height) {
          switch (side) {
            case 'front': {
              const xOffset =
                length / 2 - getSpacingBeforeBay(frontBaySpacing, opening.bay);
              const isConflict =
                opening.offset + opening.width >
                  frontBaySpacing[opening.bay - 1] ||
                opening.height + opening.sill > frontEaveHeight;
              createExtLine(
                [
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.sill,
                    xOffset - opening.offset
                  ),
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.sill,
                    xOffset - opening.offset - opening.width
                  ),
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.height + opening.sill,
                    xOffset - opening.offset - opening.width
                  ),
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.height + opening.sill,
                    xOffset - opening.offset - opening.width
                  ),
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.height + opening.sill,
                    xOffset - opening.offset
                  ),
                  new THREE.Vector3(
                    width / 2 + 0.01,
                    opening.sill,
                    xOffset - opening.offset
                  ),
                ],
                isConflict ? errorMaterial : lineMaterial
              );
              break;
            }
            case 'back': {
              const xOffset =
                -length / 2 + getSpacingBeforeBay(backBaySpacing, opening.bay);
              const isConflict =
                opening.offset + opening.width >
                  backBaySpacing[opening.bay - 1] ||
                opening.height + opening.sill > backEaveHeight;
              createExtLine(
                [
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.sill,
                    xOffset + opening.offset
                  ),
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.sill,
                    xOffset + opening.offset + opening.width
                  ),
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.height + opening.sill,
                    xOffset + opening.offset + opening.width
                  ),
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.height + opening.sill,
                    xOffset + opening.offset + opening.width
                  ),
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.height + opening.sill,
                    xOffset + opening.offset
                  ),
                  new THREE.Vector3(
                    -width / 2 - 0.01,
                    opening.sill,
                    xOffset + opening.offset
                  ),
                ],
                isConflict ? errorMaterial : lineMaterial
              );
              break;
            }
            case 'left': {
              const xOffset =
                -width / 2 + getSpacingBeforeBay(leftBaySpacing, opening.bay);
              const wallOffset = getSpacingBeforeBay(
                leftBaySpacing,
                opening.bay
              );
              const isConflict =
                opening.offset + opening.width >
                  leftBaySpacing[opening.bay - 1] ||
                opening.height + opening.sill >
                  calculateHeightAtPosition(
                    buildingData,
                    wallOffset + opening.offset,
                    false
                  ) ||
                opening.height + opening.sill >
                  calculateHeightAtPosition(
                    buildingData,
                    wallOffset + opening.offset + opening.width,
                    false
                  );

              createExtLine(
                [
                  new THREE.Vector3(
                    xOffset + opening.offset,
                    opening.sill,
                    length / 2 + 0.01
                  ),
                  new THREE.Vector3(
                    xOffset + opening.offset + opening.width,
                    opening.sill,
                    length / 2 + 0.01
                  ),
                  new THREE.Vector3(
                    xOffset + opening.offset + opening.width,
                    opening.sill + opening.height,
                    length / 2 + 0.01
                  ),
                  new THREE.Vector3(
                    xOffset + opening.offset + opening.width,
                    opening.sill + opening.height,
                    length / 2 + 0.01
                  ),
                  new THREE.Vector3(
                    xOffset + opening.offset,
                    opening.sill + opening.height,
                    length / 2 + 0.01
                  ),
                  new THREE.Vector3(
                    xOffset + opening.offset,
                    opening.sill,
                    length / 2 + 0.01
                  ),
                ],
                isConflict ? errorMaterial : lineMaterial
              );
              break;
            }
            case 'right': {
              const xOffset =
                width / 2 - getSpacingBeforeBay(rightBaySpacing, opening.bay);
              const wallOffset = getSpacingBeforeBay(
                rightBaySpacing,
                opening.bay
              );
              // Check if opening is outside of bay or above gable
              const isConflict =
                opening.offset + opening.width >
                  rightBaySpacing[opening.bay - 1] ||
                opening.height + opening.sill >
                  calculateHeightAtPosition(
                    buildingData,
                    wallOffset + opening.offset,
                    true
                  ) ||
                opening.height + opening.sill >
                  calculateHeightAtPosition(
                    buildingData,
                    wallOffset + opening.offset + opening.width,
                    true
                  );
              createExtLine(
                [
                  new THREE.Vector3(
                    xOffset - opening.offset,
                    opening.sill,
                    -length / 2 - 0.01
                  ),
                  new THREE.Vector3(
                    xOffset - opening.offset - opening.width,
                    opening.sill,
                    -length / 2 - 0.01
                  ),
                  new THREE.Vector3(
                    xOffset - opening.offset - opening.width,
                    opening.sill + opening.height,
                    -length / 2 - 0.01
                  ),
                  new THREE.Vector3(
                    xOffset - opening.offset - opening.width,
                    opening.sill + opening.height,
                    -length / 2 - 0.01
                  ),
                  new THREE.Vector3(
                    xOffset - opening.offset,
                    opening.sill + opening.height,
                    -length / 2 - 0.01
                  ),
                  new THREE.Vector3(
                    xOffset - opening.offset,
                    opening.sill,
                    -length / 2 - 0.01
                  ),
                ],
                isConflict ? errorMaterial : lineMaterial
              );
              break;
            }
          }
        }
      });
    }
  });
};

export const addPartitions = (
  scene,
  buildingData,
  activePartition,
  activeWall
) => {
  // Remove existing brace lines
  scene.children = scene.children.filter((child) => !child.isPartition);

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
    leftBaySpacing,
    rightBaySpacing,
    partitions,
  } = buildingData;

  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.4,
  });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
  const activeLineMaterial = new THREE.LineBasicMaterial({ color: 0xff6666 });
  const errorMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const dashedMaterial = new THREE.LineDashedMaterial({
    color: 0x666666,
    linewidth: 1,
    scale: 2,
    dashSize: 1,
    gapSize: 1,
  });

  const lewPoints = [
    new THREE.Vector3(-width / 2, 0, length / 2),
    new THREE.Vector3(-width / 2, backEaveHeight, length / 2),
    new THREE.Vector3(
      -width / 2 + backPeakOffset,
      calculateHeightAtPosition(buildingData, backPeakOffset),
      length / 2
    ),
    new THREE.Vector3(width / 2, frontEaveHeight, length / 2),
    new THREE.Vector3(width / 2, 0, length / 2),
    new THREE.Vector3(-width / 2, 0, length / 2),
  ];

  const createPartLine = (
    points,
    material = lineMaterial,
    isActive = false
  ) => {
    // Create line geometry
    const lewGeometry = new THREE.BufferGeometry().setFromPoints(lewPoints);
    const lewLine = new THREE.Line(
      lewGeometry,
      dashedMaterial
    ).computeLineDistances();
    lewLine.isOpening = true;
    lewLine.name = 'partition';
    scene.add(lewLine);

    // Create line geometry
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = isActive
      ? new THREE.Line(lineGeometry, activeLineMaterial)
      : new THREE.Line(lineGeometry, material);

    line.isOpening = true;
    line.name = 'partition';
    scene.add(line);

    // Create a shape for the polygon
    const shape = new THREE.Shape();

    // Start at the first point
    shape.moveTo(points[0].x, points[0].y);

    // Add all other points
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }

    // Create shape geometry
    const shapeGeometry = new THREE.ShapeGeometry(shape);

    // Get the z position from your points
    const z = points[0].z;

    // Create a double-sided material
    const doubleSidedMaterial = buildingMaterial.clone();
    doubleSidedMaterial.side = THREE.DoubleSide;

    // Create mesh from shape geometry with the double-sided material
    const building = new THREE.Mesh(shapeGeometry, doubleSidedMaterial);

    // Position the mesh at the correct Z
    building.position.z = z;

    building.isOpening = true;
    building.name = 'partition';
    scene.add(building);
  };

  // If there are partitions in the building
  if (Array.isArray(partitions) && partitions.length > 0) {
    partitions.forEach((partition, pIndex) => {
      const { orientation, start, end, offset, height, baySpacing } = partition;

      if (end && offset) {
        if (orientation == 'l') {
          const roofHeight = calculateHeightAtPosition(
            buildingData,
            offset,
            false
          );
        } else {
          // Calculate the peak height
          const peakHeight = calculateHeightAtPosition(
            buildingData,
            backPeakOffset,
            false
          );

          // Normalize the start and end inputs if blank
          const adjStart = start == '' ? 0 : start;
          const adjEnd = end == '' ? 0 : end;

          // Calculate the x-intersects between the roof and the partition
          const [startIntersect, endIntersect] = calculatePosAtHeight(
            buildingData,
            height
          );

          // If the intersects are outside of the partition, use the start and end
          const startX = Math.max(startIntersect, adjStart);
          const endX = Math.min(endIntersect, adjEnd);

          let startZ = 0;
          if (
            height > calculateHeightAtPosition(buildingData, adjStart, false)
          ) {
            startZ = calculateHeightAtPosition(buildingData, adjStart, false);
          } else {
            startZ = height;
          }

          let endZ = 0;
          if (height > calculateHeightAtPosition(buildingData, adjEnd, false)) {
            endZ = calculateHeightAtPosition(buildingData, adjEnd, false);
          } else {
            endZ = height;
          }

          const isConflict = false;
          const isFullHeight = height == 0 || height == null;
          const isAfterPeak = startX > backPeakOffset;
          const isBeforePeak = endX < backPeakOffset;

          let newHeight =
            height == 0
              ? calculateHeightAtPosition(buildingData, backPeakOffset)
              : height;

          console.log(activeWall);
          if (
            activeWall == null ||
            activeWall == 'partRoof' ||
            activeWall == `partition${pIndex + 1}`
          ) {
            createPartLine(
              [
                new THREE.Vector3(
                  -width / 2 + adjStart,
                  0,
                  length / 2 - offset
                ),
                new THREE.Vector3(
                  -width / 2 + adjStart,
                  startZ,
                  length / 2 - offset
                ),
                new THREE.Vector3(
                  -width / 2 + startX,
                  newHeight < calculateHeightAtPosition(buildingData, startX)
                    ? newHeight
                    : calculateHeightAtPosition(buildingData, startX),
                  length / 2 - offset
                ),
                new THREE.Vector3(
                  isAfterPeak
                    ? -width / 2 + startX
                    : isBeforePeak
                      ? -width / 2 + endX
                      : -width / 2 + backPeakOffset,
                  isAfterPeak
                    ? newHeight >
                      calculateHeightAtPosition(buildingData, startX)
                      ? calculateHeightAtPosition(buildingData, startX)
                      : newHeight
                    : isBeforePeak
                      ? newHeight >
                        calculateHeightAtPosition(buildingData, endX)
                        ? calculateHeightAtPosition(buildingData, endX)
                        : newHeight
                      : isFullHeight
                        ? calculateHeightAtPosition(
                            buildingData,
                            backPeakOffset
                          )
                        : newHeight,
                  length / 2 - offset
                ),
                new THREE.Vector3(
                  -width / 2 + endX,
                  newHeight < calculateHeightAtPosition(buildingData, endX)
                    ? newHeight
                    : calculateHeightAtPosition(buildingData, endX),
                  length / 2 - offset
                ),
                new THREE.Vector3(
                  -width / 2 + adjEnd,
                  endZ,
                  length / 2 - offset
                ),
                new THREE.Vector3(-width / 2 + adjEnd, 0, length / 2 - offset),
                new THREE.Vector3(
                  -width / 2 + adjStart,
                  0,
                  length / 2 - offset
                ),
              ],
              isConflict ? errorMaterial : lineMaterial,
              activePartition == pIndex
            );
          }
        }
      }
    });
  }
};
