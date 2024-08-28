import * as THREE from 'three';

export const createBuilding = (buildingData) => {
  const { width, length, eaveHeight, roofPitch } = buildingData;

  // Create building
  const buildingGeometry = new THREE.BoxGeometry(width, eaveHeight, length);
  const buildingMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.7,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = eaveHeight / 2;

  // Create roof
  const roofHeight =
    (width / 2) * Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);
  const roofGeometry = createRoofGeometry(
    width,
    length,
    eaveHeight,
    roofHeight
  );
  const roofMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);

  // Add edges
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const buildingEdges = new THREE.EdgesGeometry(buildingGeometry);
  const buildingLines = new THREE.LineSegments(buildingEdges, edgesMaterial);
  buildingLines.position.y = eaveHeight / 2;

  const roofEdges = new THREE.EdgesGeometry(roofGeometry);
  const roofLines = new THREE.LineSegments(roofEdges, edgesMaterial);

  return { building, roof, buildingLines, roofLines };
};

const createRoofGeometry = (width, length, eaveHeight, roofHeight) => {
  const roofGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -width / 2,
    eaveHeight,
    length / 2,
    width / 2,
    eaveHeight,
    length / 2,
    0,
    eaveHeight + roofHeight,
    length / 2,
    -width / 2,
    eaveHeight,
    -length / 2,
    width / 2,
    eaveHeight,
    -length / 2,
    0,
    eaveHeight + roofHeight,
    -length / 2,
  ]);
  const indices = [0, 1, 2, 3, 4, 5, 0, 2, 5, 5, 3, 0, 1, 2, 5, 5, 4, 1];
  roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  roofGeometry.setIndex(indices);
  roofGeometry.computeVertexNormals();
  return roofGeometry;
};

export const addBayLines = (spacing, wall, scene, buildingData) => {
  // Check if spacing is undefined, null, or an empty array
  if (!spacing || spacing.length === 0) {
    return; // Exit the function without adding any lines or warnings
  }

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

  const createRoofLine = (start, mid, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      start,
      mid,
      end,
    ]);
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
      return; // Skip drawing a line for the first bay
    }

    const { width, length, eaveHeight, roofPitch } = buildingData;
    const roofHeight =
      (width / 2) * Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);

    let start, end, height, roofStart, roofMid, roofEnd;

    switch (wall) {
      case 'leftEndwall':
      case 'rightEndwall':
        height =
          (width / 2 - Math.abs(width / 2 - position)) *
          Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);
        start = new THREE.Vector3(
          width / 2 - position,
          0,
          wall === 'leftEndwall' ? length / 2 + 0.1 : -length / 2 - 0.1
        );
        end = new THREE.Vector3(
          width / 2 - position,
          eaveHeight + height,
          wall === 'leftEndwall' ? length / 2 + 0.1 : -length / 2 - 0.1
        );
        createLine(start, end);
        break;
      case 'frontSidewall':
      case 'backSidewall':
        // Front sidewall line
        start = new THREE.Vector3(-width / 2 - 0.1, 0, -length / 2 + position);
        end = new THREE.Vector3(
          -width / 2 - 0.1,
          eaveHeight,
          -length / 2 + position
        );
        createLine(start, end);

        // Back sidewall line
        start = new THREE.Vector3(width / 2 + 0.1, 0, -length / 2 + position);
        end = new THREE.Vector3(
          width / 2 + 0.1,
          eaveHeight,
          -length / 2 + position
        );
        createLine(start, end);

        // Roof line
        roofStart = new THREE.Vector3(
          -width / 2,
          eaveHeight,
          -length / 2 + position
        );
        roofMid = new THREE.Vector3(
          0,
          eaveHeight + roofHeight,
          -length / 2 + position
        );
        roofEnd = new THREE.Vector3(
          width / 2,
          eaveHeight,
          -length / 2 + position
        );
        createRoofLine(roofStart, roofMid, roofEnd);
        break;
    }

    position += bay;
  });
};

export const addBraceLines = (spacing, bracing, wall, scene, buildingData) => {
  // Remove all existing brace lines for this wall
  const existingBraceLines = scene.children.filter(
    (child) => child.isBraceLine && child.wall === wall
  );
  existingBraceLines.forEach((line) => scene.remove(line));

  // If there are no braces to add, we're done
  if (!spacing || spacing.length === 0 || !bracing || bracing.length === 0) {
    return;
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  const createBraceLine = (start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(geometry, lineMaterial);
    line.isBraceLine = true;
    line.wall = wall;
    scene.add(line);
    return line;
  };

  const { width, length, eaveHeight, roofPitch } = buildingData;

  // Calculate cumulative bay positions
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

    const roofHeight =
      (width / 2) * Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);

    let startHeight =
      (width / 2 - Math.abs(width / 2 - bayStart)) *
      Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);

    let endHeight =
      (width / 2 - Math.abs(width / 2 - bayEnd)) *
      Math.tan((((roofPitch * 100) / 12) * Math.PI) / 180);

    switch (wall) {
      case 'leftEndwall':
        createBraceLine(
          new THREE.Vector3(-width / 2 + bayStart, 0, length / 2 + 0.1),
          new THREE.Vector3(
            -width / 2 + bayEnd,
            eaveHeight + endHeight,
            length / 2 + 0.1
          )
        );
        createBraceLine(
          new THREE.Vector3(
            -width / 2 + bayStart,
            eaveHeight + startHeight,
            length / 2 + 0.1
          ),
          new THREE.Vector3(-width / 2 + bayEnd, 0, length / 2 + 0.1)
        );
        break;
      case 'rightEndwall':
        createBraceLine(
          new THREE.Vector3(width / 2 - bayStart, 0, -length / 2 - 0.1),
          new THREE.Vector3(
            width / 2 - bayEnd,
            eaveHeight + endHeight,
            -length / 2 - 0.1
          )
        );
        createBraceLine(
          new THREE.Vector3(
            width / 2 - bayStart,
            eaveHeight + startHeight,
            -length / 2 - 0.1
          ),
          new THREE.Vector3(width / 2 - bayEnd, 0, -length / 2 - 0.1)
        );
        break;
      case 'frontSidewall':
        createBraceLine(
          new THREE.Vector3(width / 2 + 0.1, 0, length / 2 - bayStart),
          new THREE.Vector3(width / 2 + 0.1, eaveHeight, length / 2 - bayEnd)
        );
        createBraceLine(
          new THREE.Vector3(width / 2 + 0.1, eaveHeight, length / 2 - bayStart),
          new THREE.Vector3(width / 2 + 0.1, 0, length / 2 - bayEnd)
        );
        break;
      case 'backSidewall':
        createBraceLine(
          new THREE.Vector3(-width / 2 - 0.1, 0, -length / 2 + bayStart),
          new THREE.Vector3(-width / 2 - 0.1, eaveHeight, -length / 2 + bayEnd)
        );
        createBraceLine(
          new THREE.Vector3(
            -width / 2 - 0.1,
            eaveHeight,
            -length / 2 + bayStart
          ),
          new THREE.Vector3(-width / 2 - 0.1, 0, -length / 2 + bayEnd)
        );
        break;
      case 'roof':
        createBraceLine(
          new THREE.Vector3(
            -width / 2,
            eaveHeight + 0.1,
            length / 2 - bayStart
          ),
          new THREE.Vector3(
            0,
            eaveHeight + roofHeight + 0.1,
            length / 2 - bayEnd
          )
        );
        createBraceLine(
          new THREE.Vector3(
            0,
            eaveHeight + roofHeight + 0.1,
            length / 2 - bayStart
          ),
          new THREE.Vector3(-width / 2, eaveHeight + 1, length / 2 - bayEnd)
        );
        createBraceLine(
          new THREE.Vector3(width / 2, eaveHeight + 0.1, length / 2 - bayStart),
          new THREE.Vector3(
            0,
            eaveHeight + roofHeight + 0.1,
            length / 2 - bayEnd
          )
        );
        createBraceLine(
          new THREE.Vector3(
            0,
            eaveHeight + roofHeight + 0.1,
            length / 2 - bayStart
          ),
          new THREE.Vector3(width / 2, eaveHeight + 1, length / 2 - bayEnd)
        );
        break;
    }
  });
};
