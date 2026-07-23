// Global Three.js Context
let scene, camera, renderer, controls;

// Cube Face Orientation Vectors in 3D Space
const FACE_NORMALS = {
  FRONT:  new THREE.Vector3(0, 0, 1),   // Center / Front Face
  BACK:   new THREE.Vector3(0, 0, -1),  // Back Face
  RIGHT:  new THREE.Vector3(1, 0, 0),   // Right Face
  LEFT:   new THREE.Vector3(-1, 0, 0),  // Left Face
  TOP:    new THREE.Vector3(0, 1, 0),   // Up Face
  BOTTOM: new THREE.Vector3(0, -1, 0)   // Down Face
};

function initThreeJS() {
  const container = document.getElementById('canvas-container');

  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);

  // 2. Camera Setup
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(6, 6, 8);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 4. Orbit Controls Setup
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 20;

  // Track orientation updates on mouse drag
  controls.addEventListener('change', calculateVisibleFacesFromCamera);

  // 5. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(10, 20, 15);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-10, -10, -10);
  scene.add(fillLight);

  window.addEventListener('resize', onWindowResize, false);
}

// Function to calculate Center, Right, Left, Top, Bottom, Back based on Camera Target & Values
function calculateVisibleFacesFromCamera() {
  if (!camera || !controls) return;

  // 1. Camera Look Direction (Vector from Camera Position to Target)
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir); // Vector pointing where camera looks

  // 2. Log Camera Values
  const camPos = camera.position;
  const camRot = camera.rotation;
  const camQuat = camera.quaternion;
  const target = controls.target;

  // 3. Calculate Dot Product to find which face is facing the camera (Center Face)
  let visibleFaces = [];

  for (let [faceName, normal] of Object.entries(FACE_NORMALS)) {
    // Transform normal if the cube group itself is rotated
    let worldNormal = normal.clone();
    if (typeof rubiksCubeGroup !== 'undefined') {
      worldNormal.applyQuaternion(rubiksCubeGroup.quaternion);
    }

    // Dot product: If value < 0, face is facing towards camera
    const dot = cameraDir.dot(worldNormal);

    visibleFaces.push({
      face: faceName,
      alignment: dot
    });
  }

  // Sort by highest visibility (facing most directly to camera)
  visibleFaces.sort((a, b) => a.alignment - b.alignment);

  const centerFace = visibleFaces[0].face; // Most facing face to user
  const backFace = visibleFaces[visibleFaces.length - 1].face;

  console.log("🎥 --- Camera Debug Info ---");
  console.log(`Pos: X:${camPos.x.toFixed(2)}, Y:${camPos.y.toFixed(2)}, Z:${camPos.z.toFixed(2)}`);
  console.log(`Rot (Euler): X:${camRot.x.toFixed(2)}, Y:${camRot.y.toFixed(2)}, Z:${camRot.z.toFixed(2)}`);
  console.log(`Quaternion: X:${camQuat.x.toFixed(2)}, Y:${camQuat.y.toFixed(2)}, Z:${camQuat.z.toFixed(2)}, W:${camQuat.w.toFixed(2)}`);
  console.log(`Target (lookAt): X:${target.x.toFixed(2)}, Y:${target.y.toFixed(2)}, Z:${target.y.toFixed(2)}`);
  console.log(`🎯 Identified Center Face: ${centerFace}`);
  console.log(`🔄 Opposite Back Face: ${backFace}`);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
