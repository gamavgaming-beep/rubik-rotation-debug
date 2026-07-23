function initApp() {
  initThreeJS();
  createRubiksCube();
  animate();
  updateCameraHUD();
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth Cube Rotation logic
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

window.addEventListener('DOMContentLoaded', initApp);
