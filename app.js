function initApp() {
  try {
    initThreeJS();
    createRubiksCube();
    animate();
    updateCameraHUD();
    console.log("Rubik's Cube App Ready!");
  } catch (e) {
    console.error("App initialization failed:", e);
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
