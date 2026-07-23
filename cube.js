let rubiksCubeGroup = new THREE.Group();
let targetQuaternion = new THREE.Quaternion();
let isCubeRotating = false;

function createRubiksCube() {
  if (!scene) return;

  rubiksCubeGroup.clear();

  // Color Mapping: Right=Red, Left=Blue, Top=Yellow, Bottom=White, Front=Green, Back=Orange
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xb71234 }), // Right (X+)
    new THREE.MeshBasicMaterial({ color: 0x0046ad }), // Left (X-)
    new THREE.MeshBasicMaterial({ color: 0xffd500 }), // Top (Y+)
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Bottom (Y-)
    new THREE.MeshBasicMaterial({ color: 0x009b48 }), // Front (Z+)
    new THREE.MeshBasicMaterial({ color: 0xff5800 })  // Back (Z-)
  ];

  const geometry = new THREE.BoxGeometry(0.92, 0.92, 0.92);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Mesh(geometry, materials);
        cubie.position.set(x * 1.0, y * 1.0, z * 1.0);

        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
        cubie.add(line);

        rubiksCubeGroup.add(cubie);
      }
    }
  }

  scene.add(rubiksCubeGroup);
  targetQuaternion.copy(rubiksCubeGroup.quaternion);
}

// Relative Rotation Based on Current Facing Center
function rotateCubeTo(action) {
  if (!rubiksCubeGroup) return;

  const rotMatrix = new THREE.Matrix4();

  switch (action) {
    case 'RESET': // Reset back to initial Front Center
      targetQuaternion.set(0, 0, 0, 1);
      break;

    case 'RIGHT': // Turn current view to relative Right (90 deg around Y)
      rotMatrix.makeRotationY(-Math.PI / 2);
      targetQuaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(rotMatrix));
      break;

    case 'LEFT': // Turn current view to relative Left (90 deg around Y)
      rotMatrix.makeRotationY(Math.PI / 2);
      targetQuaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(rotMatrix));
      break;

    case 'UP': // Turn current view to relative Up (90 deg around X)
      rotMatrix.makeRotationX(Math.PI / 2);
      targetQuaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(rotMatrix));
      break;

    case 'DOWN': // Turn current view to relative Down (90 deg around X)
      rotMatrix.makeRotationX(-Math.PI / 2);
      targetQuaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(rotMatrix));
      break;

    case 'BACK': // Turn current view to relative Back (180 deg around Y)
      rotMatrix.makeRotationY(Math.PI);
      targetQuaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(rotMatrix));
      break;
  }

  isCubeRotating = true;
}

function updateCubeRotation() {
  if (isCubeRotating && rubiksCubeGroup) {
    rubiksCubeGroup.quaternion.slerp(targetQuaternion, 0.2);

    if (rubiksCubeGroup.quaternion.angleTo(targetQuaternion) < 0.001) {
      rubiksCubeGroup.quaternion.copy(targetQuaternion);
      isCubeRotating = false;
    }
    
    // Recalculate HUD Center Face real-time as cube moves
    if (typeof updateCameraHUD === 'function') {
      updateCameraHUD();
    }
  }
}
