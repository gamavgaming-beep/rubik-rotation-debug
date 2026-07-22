/* ================================= */
/* RUBIK ROTATION DEBUG */
/* cube.js - Part 1 */
/* ================================= */

let scene;
let camera;
let renderer;

let cube;

let ambientLight;
let directionalLight;

const cubeSize = 2;

const cubeContainer =
document.getElementById(
"cube-container"
);

const canvas =
document.getElementById(
"cube-canvas"
);

scene = new THREE.Scene();

scene.background =
new THREE.Color(
0x111827
);

camera =
new THREE.PerspectiveCamera(

45,

cubeContainer.clientWidth /
cubeContainer.clientHeight,

0.1,

1000

);

camera.position.set(

0,
0,
8

);

renderer =
new THREE.WebGLRenderer({

canvas:canvas,

antialias:true

});

renderer.setPixelRatio(

window.devicePixelRatio

);

renderer.setSize(

cubeContainer.clientWidth,

cubeContainer.clientHeight

);

/* ================================= */
/* LIGHTS */
/* ================================= */

ambientLight =
new THREE.AmbientLight(

0xffffff,

1.5

);

scene.add(

ambientLight

);

directionalLight =
new THREE.DirectionalLight(

0xffffff,

2

);

directionalLight.position.set(

5,
8,
10

);

scene.add(

directionalLight

);

/* ================================= */
/* CUBE GEOMETRY */
/* ================================= */

const geometry =
new THREE.BoxGeometry(

cubeSize,

cubeSize,

cubeSize

);

const materials = [

new THREE.MeshStandardMaterial({color:0xff0000}),
new THREE.MeshStandardMaterial({color:0xff8000}),
new THREE.MeshStandardMaterial({color:0xffffff}),
new THREE.MeshStandardMaterial({color:0xffff00}),
new THREE.MeshStandardMaterial({color:0x00aa00}),
new THREE.MeshStandardMaterial({color:0x0000ff})

];

cube =
new THREE.Mesh(

geometry,

materials

);

scene.add(

cube

);

/* ================================= */
/* RESIZE */
/* ================================= */

window.addEventListener(

"resize",

()=>{

camera.aspect=

cubeContainer.clientWidth/

cubeContainer.clientHeight;

camera.updateProjectionMatrix();

renderer.setSize(

cubeContainer.clientWidth,

cubeContainer.clientHeight

);

}

);

/* ================================= */
/* GRID */
/* ================================= */

const grid =

new THREE.GridHelper(

10,

10,

0x444444,

0x222222

);

grid.position.y =

-2;

scene.add(

grid

);

/* ================================= */
/* AXES */
/* ================================= */

const axes =

new THREE.AxesHelper(

3

);

scene.add(

axes

);

/* ================================= */
/* ANIMATION LOOP */
/* ================================= */

function animate(){

requestAnimationFrame(

animate

);

renderer.render(

scene,

camera

);

}

animate();

/* ================================= */
/* EXPORTS */
/* ================================= */

window.scene = scene;

window.camera = camera;

window.renderer = renderer;

window.cube = cube;
