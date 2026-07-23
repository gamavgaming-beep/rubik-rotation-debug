let rubiksCubeGroup = new THREE.Group();

// Official Standard Rubik's Colors (Hex)
const FACE_COLORS = {
  RIGHT:  0xb71234, // Red
  LEFT:   0x0046ad, // Blue
  TOP:    0xffd500, // Yellow
  BOTTOM: 0xffffff, // White
  FRONT:  0x009b48, // Green
  BACK:   0xff5800  // Orange
};

function createRubiksCube() {
  // Ensure scene exists before adding group
  if (typeof scene === 'undefined') {
    console.error("Scene is not defined yet!");
    return;
  }

  rubiksCubeGroup.clear(); // Clear previous mesh group if exists

  const cubieSize = 0.94;
  const spacing = 1.0;

  // Create Standard Materials for each face
  const materials = [
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.RIGHT, roughness: 0.2, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.LEFT, roughness: 0.2, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.TOP, roughness: 0.2, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.BOTTOM, roughness: 0.2, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.FRONT, roughness: 0.2, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: FACE_COLORS.BACK, roughness: 0.2, metalness: 0.1 })
  ];

  const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

  // Loop through 3x3x3 grid coordinates
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Mesh(geometry, materials);
        cubie.position.set(x * spacing, y * spacing, z * spacing);
        cubie.userData = { initialX: x, initialY: y, initialZ: z };
        
        rubiksCubeGroup.add(cubie);
      }
    }
  }

  scene.add(rubiksCubeGroup);
  console.log("Rubik's Cube Mesh successfully added to Scene.");
}
