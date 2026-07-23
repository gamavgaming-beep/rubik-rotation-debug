let scene, camera, renderer, controls;

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
  scene.background = new THREE.Color(0x111116);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 7); // Angle-la set panna visual clearance nalla irukum

  renderer = new THREE.WebGLRenderer({ antialias: true });
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

  const getEl = id => document.getElementById(id);

  if (getEl('pos-x')) getEl('pos-x').innerText = pos.x.toFixed(3);
  if (getEl('pos-y')) getEl('pos-y').innerText = pos.y.toFixed(3);
  if (getEl('pos-z')) getEl('pos-z').innerText = pos.z.toFixed(3);

  if (getEl('rot-x')) getEl('rot-x').innerText = rot.x.toFixed(3);
  if (getEl('rot-y')) getEl('rot-y').innerText = rot.y.toFixed(3);
  if (getEl('rot-z')) getEl('rot-z').innerText = rot.z.toFixed(3);

  if (getEl('quat-x')) getEl('quat-x').innerText = quat.x.toFixed(3);
  if (getEl('quat-y')) getEl('quat-y').innerText = quat.y.toFixed(3);
  if (getEl('quat-z')) getEl('quat-z').innerText = quat.z.toFixed(3);
  if (getEl('quat-w')) getEl('quat-w').innerText = quat.w.toFixed(3);

  if (getEl('target-x')) getEl('target-x').innerText = target.x.toFixed(3);
  if (getEl('target-y')) getEl('target-y').innerText = target.y.toFixed(3);
  if (getEl('target-z')) getEl('target-z').innerText = target.z.toFixed(3);

  const distance = controls.getDistance();
  const azimuthRad = controls.getAzimuthalAngle();
  const polarRad = controls.getPolarAngle();

  const azimuthDeg = (azimuthRad * (180 / Math.PI)).toFixed(2);
  const polarDeg = (polarRad * (180 / Math.PI)).toFixed(2);

  if (getEl('orbit-dist')) getEl('orbit-dist').innerText = distance.toFixed(3);
  if (getEl('orbit-azimuth')) getEl('orbit-azimuth').innerText = `${azimuthDeg}° (${azimuthRad.toFixed(2)} rad)`;
  if (getEl('orbit-polar')) getEl('orbit-polar').innerText = `${polarDeg}° (${polarRad.toFixed(2)} rad)`;

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

  visibleFaces.sort((a, b) => a.dot - b.dot);

  const centerFace = visibleFaces[0].face;
  if (getEl('center-face')) getEl('center-face').innerText = centerFace;
  if (getEl('back-face')) getEl('back-face').innerText = visibleFaces[visibleFaces.length - 1].face;

  if (getEl('current-view')) {
    getEl('current-view').innerText = !isAnimating ? centerFace : activeViewName;
  }
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
