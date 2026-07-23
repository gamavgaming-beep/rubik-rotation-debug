let scene, camera, renderer, controls;

const FACE_NORMALS = {
  FRONT:  new THREE.Vector3(0, 0, 1),
  BACK:   new THREE.Vector3(0, 0, -1),
  RIGHT:  new THREE.Vector3(1, 0, 0),
  LEFT:   new THREE.Vector3(-1, 0, 0),
  TOP:    new THREE.Vector3(0, 1, 0),
  BOTTOM: new THREE.Vector3(0, -1, 0)
};

function initThreeJS() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);

  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(6, 6, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Real-time HUD update listener on camera movement
  controls.addEventListener('change', updateCameraHUD);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(10, 20, 15);
  scene.add(mainLight);

  window.addEventListener('resize', onWindowResize, false);
  
  // First time HUD render
  updateCameraHUD();
}

function updateCameraHUD() {
  if (!camera || !controls) return;

  const pos = camera.position;
  const rot = camera.rotation;
  const quat = camera.quaternion;
  const target = controls.target;

  // Update DOM values directly
  document.getElementById('pos-x').innerText = pos.x.toFixed(3);
  document.getElementById('pos-y').innerText = pos.y.toFixed(3);
  document.getElementById('pos-z').innerText = pos.z.toFixed(3);

  document.getElementById('rot-x').innerText = rot.x.toFixed(3);
  document.getElementById('rot-y').innerText = rot.y.toFixed(3);
  document.getElementById('rot-z').innerText = rot.z.toFixed(3);

  document.getElementById('quat-x').innerText = quat.x.toFixed(3);
  document.getElementById('quat-y').innerText = quat.y.toFixed(3);
  document.getElementById('quat-z').innerText = quat.z.toFixed(3);
  document.getElementById('quat-w').innerText = quat.w.toFixed(3);

  document.getElementById('target-x').innerText = target.x.toFixed(3);
  document.getElementById('target-y').innerText = target.y.toFixed(3);
  document.getElementById('target-z').innerText = target.z.toFixed(3);

  // Face Detection Logic
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

  document.getElementById('center-face').innerText = visibleFaces[0].face;
  document.getElementById('back-face').innerText = visibleFaces[visibleFaces.length - 1].face;
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
