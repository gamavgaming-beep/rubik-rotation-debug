function initApp() {
  try {
    initThreeJS();
    createRubiksCube();
    animate();
    updateCameraHUD();
    console.log("3D Rubik's App Started Successfully!");
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

function animate() {
  requestAnimationFrame(animate);

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

// Guarantee execution when window loads
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
} else {
  window.addEventListener('DOMContentLoaded', initApp);
}
