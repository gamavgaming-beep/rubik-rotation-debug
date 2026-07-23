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
  scene.background = new THREE.Color(0x0f172a);

  // Camera looking directly at the Front face
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

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

function updateCameraHUD() {
  if (!camera || !controls) return;

  const pos = camera.position;
  const rot = camera.rotation;
  const target = controls.target;

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.innerText = txt;
  };

  setTxt('pos-x', pos.x.toFixed(2));
  setTxt('pos-y', pos.y.toFixed(2));
  setTxt('pos-z', pos.z.toFixed(2));

  setTxt('rot-x', rot.x.toFixed(2));
  setTxt('rot-y', rot.y.toFixed(2));
  setTxt('rot-z', rot.z.toFixed(2));

  setTxt('target-x', target.x.toFixed(2));
  setTxt('target-y', target.y.toFixed(2));
  setTxt('target-z', target.z.toFixed(2));

  const distance = camera.position.distanceTo(target);
  const azimuthRad = controls.getAzimuthalAngle();
  const polarRad = controls.getPolarAngle();

  const azimuthDeg = (azimuthRad * (180 / Math.PI)).toFixed(2);
  const polarDeg = (polarRad * (180 / Math.PI)).toFixed(2);

  setTxt('orbit-dist', distance.toFixed(2));
  setTxt('orbit-azimuth', `${azimuthDeg}°`);
  setTxt('orbit-polar', `${polarDeg}°`);

  if (typeof rubiksCubeGroup !== 'undefined' && rubiksCubeGroup) {
    const quat = rubiksCubeGroup.quaternion;
    setTxt('quat-x', quat.x.toFixed(2));
    setTxt('quat-y', quat.y.toFixed(2));
    setTxt('quat-z', quat.z.toFixed(2));
    setTxt('quat-w', quat.w.toFixed(2));

    // Vector pointing from camera towards the origin (0,0,0)
    const cameraVector = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();

    let bestMatch = null;
    let maxDot = -Infinity;

    for (let [faceName, normal] of Object.entries(FACE_NORMALS)) {
      let worldNormal = normal.clone().applyQuaternion(rubiksCubeGroup.quaternion);
      
      // Dot product to measure direct alignment with camera center
      const dot = worldNormal.dot(cameraVector);
      if (dot > maxDot) {
        maxDot = dot;
        bestMatch = faceName;
      }
    }

    // Determine Back Face
    let oppositeFace = "BACK";
    if (bestMatch === "FRONT") oppositeFace = "BACK";
    else if (bestMatch === "BACK") oppositeFace = "FRONT";
    else if (bestMatch === "RIGHT") oppositeFace = "LEFT";
    else if (bestMatch === "LEFT") oppositeFace = "RIGHT";
    else if (bestMatch === "TOP") oppositeFace = "BOTTOM";
    else if (bestMatch === "BOTTOM") oppositeFace = "TOP";

    setTxt('center-face', bestMatch);
    setTxt('back-face', oppositeFace);
    setTxt('current-view', bestMatch);
  }
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
