function initApp() {
  try {
    initThreeJS();
    createRubiksCube();
    bindButtonEvents();
    animate();
    updateCameraHUD();
    console.log("App loaded successfully!");
  } catch (e) {
    console.error("App initialization failed:", e);
  }
}

// Event Listeners for Reliable Button Clicks
function bindButtonEvents() {
  const btnMap = {
    'btn-reset': 'RESET',
    'btn-right': 'RIGHT',
    'btn-left': 'LEFT',
    'btn-up': 'UP',
    'btn-down': 'DOWN',
    'btn-back': 'BACK'
  };

  for (let [id, action] of Object.entries(btnMap)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        rotateCubeTo(action);
      });
    }
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
