/* ================================= */
/* CAMERA ENGINE */
/* camera.js - Part 1 */
/* ================================= */

const faces = [

"Front",

"Right",

"Up",

"Back",

"Left",

"Down"

];

let currentFace = 0;

const faceLabel =

document.getElementById(

"current-face"

);

const nextButton =

document.getElementById(

"next-btn"

);

const previousButton =

document.getElementById(

"previous-btn"

);

const resetButton =

document.getElementById(

"reset-btn"

);

const quatX =

document.getElementById("quat-x");

const quatY =

document.getElementById("quat-y");

const quatZ =

document.getElementById("quat-z");

const quatW =

document.getElementById("quat-w");

const eulerX =

document.getElementById("euler-x");

const eulerY =

document.getElementById("euler-y");

const eulerZ =

document.getElementById("euler-z");

/* ================================= */
/* CAMERA VALUES */
/* ================================= */

const cameraX =

document.getElementById(

"camera-x"

);

const cameraY =

document.getElementById(

"camera-y"

);

const cameraZ =

document.getElementById(

"camera-z"

);

const historyList =

document.getElementById(

"history-list"

);

const euler =

new THREE.Euler();

const quaternion =

new THREE.Quaternion();

const radius = 8;

let isAnimating = false;


/* ================================= */
/* FACE POSITIONS */
/* ================================= */

const facePositions = [

new THREE.Vector3(
0,
0,
radius
),

new THREE.Vector3(
radius,
0,
0
),

new THREE.Vector3(
0,
radius,
0
),

new THREE.Vector3(
0,
0,
-radius
),

new THREE.Vector3(
-radius,
0,
0
),

new THREE.Vector3(
0,
-radius,
0
)

];

function lookAtCube(){

camera.lookAt(

0,
0,
0

);

}


/* ================================= */
/* UPDATE UI */
/* ================================= */

function updateUI(){

faceLabel.textContent =

faces[currentFace];

cameraX.textContent =

camera.position.x.toFixed(3);

cameraY.textContent =

camera.position.y.toFixed(3);

cameraZ.textContent =

camera.position.z.toFixed(3);

quatX.textContent =

camera.quaternion.x.toFixed(4);

quatY.textContent =

camera.quaternion.y.toFixed(4);

quatZ.textContent =

camera.quaternion.z.toFixed(4);

quatW.textContent =

camera.quaternion.w.toFixed(4);

euler.setFromQuaternion(

camera.quaternion,

"XYZ"

);

eulerX.textContent =

THREE.MathUtils.radToDeg(

euler.x

).toFixed(1)+"°";

eulerY.textContent =

THREE.MathUtils.radToDeg(

euler.y

).toFixed(1)+"°";

eulerZ.textContent =

THREE.MathUtils.radToDeg(

euler.z

).toFixed(1)+"°";

}
