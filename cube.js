let rubiksCubeGroup = new THREE.Group();

function createRubiksCube() {
  if (!scene) {
    console.error("Scene is undefined!");
    return;
  }

  rubiksCubeGroup.clear();

  // Basic Materials (No Light dependencies - Guarantee rendering)
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

        // Add distinct black border frame
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
        cubie.add(line);

        rubiksCubeGroup.add(cubie);
      }
    }
  }

  scene.add(rubiksCubeGroup);
  console.log("3D Rubik's Cube successfully created!");
}
