let rubiksCubeGroup = new THREE.Group();
let targetQuaternion = new THREE.Quaternion();
let isCubeRotating = false;

function createRubiksCube() {
  if (!scene) return;

  rubiksCubeGroup.clear();

  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xb71234 }), // Right: Red
    new THREE.MeshBasicMaterial({ color: 0x0046ad }), // Left: Blue
    new THREE.MeshBasicMaterial({ color: 0xffd500 }), // Top: Yellow
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Bottom: White
    new THREE.MeshBasicMaterial({ color: 0x009b48 }), // Front: Green
    new THREE.MeshBasicMaterial({ color: 0xff5800 })  // Back: Orange
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

function rotateCubeTo(action) {
  if (!rubiksCubeGroup) return;

  const rotMatrix = new THREE.Matrix4();

  switch (action) {
    case 'RESET':
      targetQuaternion.set(0, 0, 0, 1);
      break;
    case 'RIGHT':
      rotMatrix.makeRotationY(-Math.PI / 2);
      targetQuaternion.multiplyQuaternions(rotMatrix, targetQuaternion);
      break;
    case 'LEFT':
      rotMatrix.makeRotationY(Math.PI / 2);
      targetQuaternion.multiplyQuaternions(rotMatrix, targetQuaternion);
      break;
    case 'UP':
      rotMatrix.makeRotationX(Math.PI / 2);
      targetQuaternion.multiplyQuaternions(rotMatrix, targetQuaternion);
      break;
    case 'DOWN':
      rotMatrix.makeRotationX(-Math.PI / 2);
      targetQuaternion.multiplyQuaternions(rotMatrix, targetQuaternion);
      break;
    case 'BACK':
      rotMatrix.makeRotationY(Math.PI);
      targetQuaternion.multiplyQuaternions(rotMatrix, targetQuaternion);
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
    if (typeof updateCameraHUD === 'function') {
      updateCameraHUD();
    }
  }
}
