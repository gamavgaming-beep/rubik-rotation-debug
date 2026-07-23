// Main Execution Entry Point

function initApp() {
  try {
    // Step 1: Initialize Camera, Lights & Renderer First
    if (typeof initThreeJS === 'function') {
      initThreeJS();
    } else {
      console.error("initThreeJS function is missing!");
    }

    // Step 2: Build 3D Rubik's Cube Next
    if (typeof createRubiksCube === 'function') {
      createRubiksCube();
    } else {
      console.error("createRubiksCube function is missing!");
    }

    // Step 3: Trigger Animation Frame Loop
    animate();

    console.log("Rubik's Cube 3D Application initialized successfully!");
  } catch (err) {
    console.error("Initialization Error:", err);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Safe check for smooth button transition animation handler
  if (typeof updateCameraTransition === 'function') {
    updateCameraTransition();
  }

  // Update Orbit Controls Damping
  if (typeof controls !== 'undefined' && controls) {
    controls.update();
  }

  // Render Scene safely
  if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
    renderer.render(scene, camera);
  }
}

// Ensure DOM content is fully loaded before executing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
