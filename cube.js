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

// Screen/Camera Relative Axis Rotation
function rotateCubeTo(action) {
  if (!rubiksCubeGroup || !camera) return;

  // Get camera's screen directions in world space
  const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

  const qDelta = new THREE.Quaternion();
  const angle = Math.PI / 2; // 90 degrees

  switch (action) {
    case 'RESET':
      targetQuaternion.set(0, 0, 0, 1);
      isCubeRotating = true;
      return;

    case 'RIGHT': // Rotate around camera's UP axis (turns cube left/right relative to screen)
      qDelta.setFromAxisAngle(cameraUp, -angle);
      break;

    case 'LEFT': 
      qDelta.setFromAxisAngle(cameraUp, angle);
      break;

    case 'UP': // Rotate around camera's RIGHT axis (turns cube up/down relative to screen)
      qDelta.setFromAxisAngle(cameraRight, angle);
      break;

    case 'DOWN': 
      qDelta.setFromAxisAngle(cameraRight, -angle);
      break;

    case 'BACK': // 180 flip
      qDelta.setFromAxisAngle(cameraUp, Math.PI);
      break;
  }

  // Multiply with target quaternion to maintain continuous relative rotation
  targetQuaternion.premultiply(qDelta);
  isCubeRotating = true;
}

function updateCubeRotation() {
  if (isCubeRotating && rubiksCubeGroup) {
    rubiksCubeGroup.quaternion.slerp(targetQuaternion, 0.2);

    if (rubiksCubeGroup.quaternion.angleTo(targetQuaternion) < 0.001) {
      rubiksCubeGroup.quaternion.copy(targetQuaternion);
      isCubeRotating = false;
    }
    
    // Live HUD update
    if (typeof updateCameraHUD === 'function') {
      updateCameraHUD();
    }
  }
}
