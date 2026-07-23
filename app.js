function initApp() {
  try {
    initThreeJS();
    createRubiksCube();
    attachButtonListeners();
    animate();
    updateCameraHUD();
  } catch (e) {
    console.error("Initialization failed:", e);
  }
}

// Touch & Click Event Listener for Mobile & Desktop
function attachButtonListeners() {
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
      const triggerAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        rotateCubeTo(action);
      };
      
      // Supporting both Click and Touch End
      btn.addEventListener('pointerdown', triggerAction);
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
