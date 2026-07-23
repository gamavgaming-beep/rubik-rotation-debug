// Main Execution Entry Point

function initApp() {
  try {
    // Step 1: Initialize Camera & Renderer
    initThreeJS();

    // Step 2: Build 3D Rubik's Cube
    createRubiksCube();

    // Step 3: Trigger Animation Frame Loop
    animate();

    console.log("Rubik's Cube 3D Application initialized successfully!");
  } catch (err) {
    console.error("Initialization Error:", err);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Update Orbit Controls Damping
  if (controls) {
    controls.update();
  }

  // Render Frame
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Execute script after DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

