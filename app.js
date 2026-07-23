function initApp() {
  // Step 1: Initialize Camera Setup
  initThreeJS();

  // Step 2: Build 3D Rubik's Cube
  createRubiksCube();

  // Step 3: Trigger Animation Loop
  animate();

  // Initial HUD update
  updateCameraHUD();
}

function animate() {
  requestAnimationFrame(animate);

  updateCameraTransition();

  if (controls) {
    controls.update();
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Ensure page DOM elements are ready before execution
window.addEventListener('DOMContentLoaded', initApp);
