// Global Three.js Scene, Camera, Renderer, Controls
let scene, camera, renderer, controls;

function initThreeJS() {
  const container = document.getElementById('canvas-container');

  // Create Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);

  // Setup Perspective Camera
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(6, 6, 8);

  // Setup WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Append Renderer Canvas to DOM Container
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Setup Orbit Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 20;

  // Add Ambient and Directional Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(10, 20, 15);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-10, -10, -10);
  scene.add(fillLight);

  // Window Resize Listener
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
