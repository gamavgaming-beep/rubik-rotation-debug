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

/* ================================= */
/* MOVE CAMERA */
/* ================================= */

function moveToFace(index){

if(isAnimating){

return;

}

isAnimating = true;

currentFace = index;

camera.position.copy(

facePositions[index]

);

lookAtCube();

updateUI();

historyList.innerHTML +=

"<p>"+faces[index]+"</p>";

historyList.scrollTop =

historyList.scrollHeight;

setTimeout(()=>{

isAnimating = false;

},200);

}

/* ================================= */
/* NEXT / PREVIOUS */
/* ================================= */

function nextFace(){

if(isAnimating) return;

currentFace++;

if(currentFace>=faces.length){

currentFace=0;

}

moveToFace(

currentFace

);

}

function previousFace(){

if(isAnimating) return;

currentFace--;

if(currentFace<0){

currentFace=

faces.length-1;

}

moveToFace(

currentFace

);

}


/* ================================= */
/* EVENTS & INIT */
/* ================================= */

nextButton.addEventListener(

"click",

nextFace

);

previousButton.addEventListener(

"click",

previousFace

);

resetButton.addEventListener(

"click",

()=>{

currentFace = 0;

moveToFace(

0

);

}

);

moveToFace(

0

);

updateUI();

/* ================================= */
/* FACE BUTTONS */
/* ================================= */

document.getElementById(

"front-btn"

).addEventListener(

"click",

()=>moveToFace(0)

);

document.getElementById(

"right-btn"

).addEventListener(

"click",

()=>moveToFace(1)

);

document.getElementById(

"up-btn"

).addEventListener(

"click",

()=>moveToFace(2)

);

document.getElementById(

"back-btn"

).addEventListener(

"click",

()=>moveToFace(3)

);

document.getElementById(

"left-btn"

).addEventListener(

"click",

()=>moveToFace(4)

);

document.getElementById(

"down-btn"

).addEventListener(

"click",

()=>moveToFace(5)

);
