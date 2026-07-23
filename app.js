function initApp() {
  try {
    // 1. First Camera and Scene Setup
    initThreeJS();

    // 2. Second Create Cube after Scene is Ready
    createRubiksCube();

    // 3. Render Loop
    animate();

    // 4. Initial HUD Update
    updateCameraHUD();

    console.log("Rubik's Cube App Loaded Successfully!");
  } catch (e) {
    console.error("App initialization failed:", e);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth Cube Rotation
  if (typeof updateCubeRotation === 'function') {
    updateCubeRotation();
  }

  if (controls) {
    controls.update();
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Ensure execution after full DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
