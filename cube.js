let rubiksCubeGroup = new THREE.Group();

// Official Standard Rubik's Colors (Hex)
const FACE_COLORS = [
  0xb71234, // 0: Right - Red
  0x0046ad, // 1: Left - Blue
  0xffd500, // 2: Top - Yellow
  0xffffff, // 3: Bottom - White
  0x009b48, // 4: Front - Green
  0xff5800  // 5: Back - Orange
];

function createRubiksCube() {
  if (typeof scene === 'undefined') {
    console.error("Scene missing!");
    return;
  }

  rubiksCubeGroup.clear();

  const cubieSize = 0.92;
  const spacing = 1.0;

  // Use MeshBasicMaterial to guarantee visibility without lighting dependency
  const materials = FACE_COLORS.map(color => new THREE.MeshBasicMaterial({ color: color }));

  const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

  // Build 3x3x3 Cube Grid
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Mesh(geometry, materials);
        cubie.position.set(x * spacing, y * spacing, z * spacing);
        
        // Add black outline borders around each cubie
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
        cubie.add(line);

        rubiksCubeGroup.add(cubie);
      }
    }
  }

  scene.add(rubiksCubeGroup);
  console.log("3D Cube Rendered Successfully!");
}
