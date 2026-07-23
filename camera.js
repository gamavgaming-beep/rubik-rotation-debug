let scene, camera, renderer, controls;

// Target camera position vectors
const FACE_POSITIONS = {
  FRONT:  new THREE.Vector3(0, 0, 8),
  RIGHT:  new THREE.Vector3(8, 0, 0),
  LEFT:   new THREE.Vector3(-8, 0, 0),
  TOP:    new THREE.Vector3(0, 8, 0),
  BOTTOM: new THREE.Vector3(0, -8, 0),
  BACK:   new THREE.Vector3(0, 0, -8)
};

const FACE_NORMALS = {
  FRONT:  new THREE.Vector3(0, 0, 1),
  BACK:   new THREE.Vector3(0, 0, -1),
  RIGHT:  new THREE.Vector3(1, 0, 0),
  LEFT:   new THREE.Vector3(-1, 0, 0),
  TOP:    new THREE.Vector3(0, 1, 0),
  BOTTOM: new THREE.Vector3(0, -1, 0)
};

let activeViewName = "FRONT";
let targetCameraPos = null;
let isAnimating = false;

function initThreeJS() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);

  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(0, 0, 8); // Default Front Center View

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.addEventListener('change', updateCameraHUD);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(10, 20, 15);
  scene.add(mainLight);

  window.addEventListener('resize', onWindowResize, false);
  
  updateCameraHUD();
}

function moveCameraToFace(faceName) {
  if (FACE_POSITIONS[faceName]) {
    activeViewName = faceName;
    targetCameraPos = FACE_POSITIONS[faceName].clone();
    isAnimating = true;
  }
}

function updateCameraTransition() {
  if (isAnimating && targetCameraPos) {
    camera.position.lerp(targetCameraPos, 0.08);
    controls.target.set(0, 0, 0);
    controls.update();

    if (camera.position.distanceTo(targetCameraPos) < 0.02) {
      camera.position.copy(targetCameraPos);
      isAnimating = false;
    }
    updateCameraHUD();
  }
}

function updateCameraHUD() {
  if (!camera || !controls) return;

  const pos = camera.position;
  const rot = camera.rotation;
  const quat = camera.quaternion;
  const target = controls.target;

  // 1. Position
  document.getElementById('pos-x').innerText = pos.x.toFixed(3);
  document.getElementById('pos-y').innerText = pos.y.toFixed(3);
  document.getElementById('pos-z').innerText = pos.z.toFixed(3);

  // 2. Rotation Euler
  document.getElementById('rot-x').innerText = rot.x.toFixed(3);
  document.getElementById('rot-y').innerText = rot.y.toFixed(3);
  document.getElementById('rot-z').innerText = rot.z.toFixed(3);

  // 3. Quaternion
  document.getElementById('quat-x').innerText = quat.x.toFixed(3);
  document.getElementById('quat-y').innerText = quat.y.toFixed(3);
  document.getElementById('quat-z').innerText = quat.z.toFixed(3);
  document.getElementById('quat-w').innerText = quat.w.toFixed(3);

  // 4. LookAt Target
  document.getElementById('target-x').innerText = target.x.toFixed(3);
  document.getElementById('target-y').innerText = target.y.toFixed(3);
  document.getElementById('target-z').innerText = target.z.toFixed(3);

  // 5. OrbitControls Calculation: Distance, Azimuth & Polar Angles
  const distance = controls.getDistance();
  const azimuthRad = controls.getAzimuthalAngle(); // Horizontal angle (-PI to PI)
  const polarRad = controls.getPolarAngle();       // Vertical angle (0 to PI)

  // Convert Radians to Degrees
  const azimuthDeg = (azimuthRad * (180 / Math.PI)).toFixed(2);
  const polarDeg = (polarRad * (180 / Math.PI)).toFixed(2);

  document.getElementById('orbit-dist').innerText = distance.toFixed(3);
  document.getElementById('orbit-azimuth').innerText = `${azimuthDeg}° (${azimuthRad.toFixed(2)} rad)`;
  document.getElementById('orbit-polar').innerText = `${polarDeg}° (${polarRad.toFixed(2)} rad)`;

  // 6. Face Detection
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);

  let visibleFaces = [];
  for (let [faceName, normal] of Object.entries(FACE_NORMALS)) {
    let worldNormal = normal.clone();
    if (typeof rubiksCubeGroup !== 'undefined') {
      worldNormal.applyQuaternion(rubiksCubeGroup.quaternion);
    }
    const dot = cameraDir.dot(worldNormal);
    visibleFaces.push({ face: faceName, dot: dot });
  }

  visibleFaces.sort((a, b) => a.dot - b.dot);

  const centerFace = visibleFaces[0].face;
  document.getElementById('center-face').innerText = centerFace;
  document.getElementById('back-face').innerText = visibleFaces[visibleFaces.length - 1].face;

  // Set Current View dynamically if not animating
  if (!isAnimating) {
    document.getElementById('current-view').innerText = centerFace;
  } else {
    document.getElementById('current-view').innerText = activeViewName;
  }
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
