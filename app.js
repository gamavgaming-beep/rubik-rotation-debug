function initApp() {
  try {
    initThreeJS();
    createRubiksCube();
    animate();
    updateCameraHUD();
  } catch (e) {
    console.error("Initialization Failed:", e);
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

// Auto run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
