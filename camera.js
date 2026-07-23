let scene, camera, renderer, controls;

// Exact Face Normals for Rubik's Cube
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
  scene.background = new THREE.Color(0x0f172a); // Modern Dark Slate Background

  // Fixed Camera Setup looking directly at Cube Center
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8); 

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.addEventListener('change', updateCameraHUD);

  window.addEventListener('resize', onWindowResize);
}

function updateCameraHUD() {
  if (!camera || !controls) return;

  const pos = camera.position;
  const rot = camera.rotation;
  const quat = camera.quaternion;
  const target = controls.target;

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.innerText = txt;
  };

  // Camera Metrics
  setTxt('pos-x', pos.x.toFixed(2));
  setTxt('pos-y', pos.y.toFixed(2));
  setTxt('pos-z', pos.z.toFixed(2));

  setTxt('rot-x', rot.x.toFixed(2));
  setTxt('rot-y', rot.y.toFixed(2));
  setTxt('rot-z', rot.z.toFixed(2));

  setTxt('quat-x', quat.x.toFixed(2));
  setTxt('quat-y', quat.y.toFixed(2));
  setTxt('quat-z', quat.z.toFixed(2));
  setTxt('quat-w', quat.w.toFixed(2));

  setTxt('target-x', target.x.toFixed(2));
  setTxt('target-y', target.y.toFixed(2));
  setTxt('target-z', target.z.toFixed(2));

  // Orbit Distance & Angles
  const distance = controls.getDistance();
  const azimuthRad = controls.getAzimuthalAngle();
  const polarRad = controls.getPolarAngle();

  const azimuthDeg = (azimuthRad * (180 / Math.PI)).toFixed(2);
  const polarDeg = (polarRad * (180 / Math.PI)).toFixed(2);

  setTxt('orbit-dist', distance.toFixed(2));
  setTxt('orbit-azimuth', `${azimuthDeg}°`);
  setTxt('orbit-polar', `${polarDeg}°`);

  // Calculate Relative Active Face (Center & Back Face Calculation)
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);

  let visibleFaces = [];
  for (let [faceName, normal] of Object.entries(FACE_NORMALS)) {
    let worldNormal = normal.clone();
    if (typeof rubiksCubeGroup !== 'undefined' && rubiksCubeGroup) {
      worldNormal.applyQuaternion(rubiksCubeGroup.quaternion);
    }
    const dot = cameraDir.dot(worldNormal);
    visibleFaces.push({ face: faceName, dot: dot });
  }

  // Sort faces based on alignment with camera view vector
  visibleFaces.sort((a, b) => a.dot - b.dot);

  const centerFace = visibleFaces[0].face;
  const backFace = visibleFaces[visibleFaces.length - 1].face;

  setTxt('center-face', centerFace);
  setTxt('back-face', backFace);
  setTxt('current-view', centerFace);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
