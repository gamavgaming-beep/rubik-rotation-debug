/* ================================= */
/* APP */
/* app.js - Part 1 */
/* ================================= */

window.addEventListener(

"load",

()=>{

const loading =

document.getElementById(

"loading-screen"

);

setTimeout(

()=>{

loading.style.opacity =

"0";

loading.style.pointerEvents =

"none";

setTimeout(

()=>{

loading.style.display =

"none";

},

500

);

},

800

);

}
);


/* ================================= */
/* STARTUP */
/* ================================= */

window.addEventListener(

"DOMContentLoaded",

()=>{

if(

typeof moveToFace ===

"function"

){

moveToFace(

0

);

}

if(

typeof updateUI ===

"function"

){

updateUI();

}

console.log(

"Rubik Rotation Debug Ready"

);

}
);

/* ================================= */
/* KEYBOARD SHORTCUTS */
/* ================================= */

document.addEventListener(

"keydown",

(event)=>{

switch(

event.key

){

case "ArrowRight":

nextFace();

break;

case "ArrowLeft":

previousFace();

break;

case "Home":

moveToFace(

0

);

break;

}

}

);

/* ================================= */
/* WINDOW FOCUS */
/* ================================= */

window.addEventListener(

"focus",

()=>{

if(

typeof updateUI===

"function"

){

updateUI();

}

}

);

/* ================================= */
/* FINISHED */
/* ================================= */

console.log(

"Application Loaded Successfully"

);
