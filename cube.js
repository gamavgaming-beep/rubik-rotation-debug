/* ==========================================
   RUBIK ROTATION DEBUG
   cube.js v2 - Part 1
========================================== */

const container =
document.getElementById(
"cube-container"
);

const canvas =
document.getElementById(
"cube-canvas"
);

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(
0x111827
);

const camera =
new THREE.PerspectiveCamera(

45,

container.clientWidth /
container.clientHeight,

0.1,

1000

);

camera.position.set(

4,
4,
6

);

camera.lookAt(

0,
0,
0

);

const renderer =
new THREE.WebGLRenderer({

canvas,

antialias:true,

alpha:false

});

renderer.setPixelRatio(

window.devicePixelRatio

);

renderer.setSize(

container.clientWidth,

container.clientHeight

);

renderer.shadowMap.enabled = true;


/* ==========================================
   LIGHTS
========================================== */

const ambientLight =
new THREE.AmbientLight(

0xffffff,

1.2

);

scene.add(

ambientLight

);

const hemiLight =
new THREE.HemisphereLight(

0xffffff,

0x444444,

1.4

);

hemiLight.position.set(

0,
20,
0

);

scene.add(

hemiLight

);

const dirLight =
new THREE.DirectionalLight(

0xffffff,

2

);

dirLight.position.set(

5,
10,
8

);

dirLight.castShadow = true;

scene.add(

dirLight

);

/* ==========================================
   RUBIK CUBE
========================================== */

const geometry =
new THREE.BoxGeometry(

2,
2,
2

);

const materials = [

new THREE.MeshStandardMaterial({color:0xff0000}), // Right
new THREE.MeshStandardMaterial({color:0xff8000}), // Left
new THREE.MeshStandardMaterial({color:0xffffff}), // Top
new THREE.MeshStandardMaterial({color:0xffff00}), // Bottom
new THREE.MeshStandardMaterial({color:0x00aa00}), // Front
new THREE.MeshStandardMaterial({color:0x0000ff})  // Back

];

const cube =
new THREE.Mesh(

geometry,

materials

);

cube.castShadow = true;

cube.receiveShadow = true;

scene.add(

cube

);

/* ==========================================
   GROUND & HELPERS
========================================== */

const ground =

new THREE.Mesh(

new THREE.PlaneGeometry(

20,
20

),

new THREE.MeshStandardMaterial({

color:0x222222

})

);

ground.rotation.x =

-Math.PI/2;

ground.position.y =

-2;

ground.receiveShadow = true;

scene.add(

ground

);

const grid =

new THREE.GridHelper(

20,
20,
0x555555,
0x333333

);

grid.position.y =

-1.99;

scene.add(

grid

);

const axes =

new THREE.AxesHelper(

3

);

scene.add(

axes

);

/* ==========================================
   RESIZE
========================================== */

window.addEventListener(

"resize",

()=>{

camera.aspect =

container.clientWidth /

container.clientHeight;

camera.updateProjectionMatrix();

renderer.setSize(

container.clientWidth,

container.clientHeight

);

}

);

/* ==========================================
   ANIMATION
========================================== */

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

/* ==========================================
   EXPORTS
========================================== */

window.scene = scene;

window.camera = camera;

window.renderer = renderer;

window.cube = cube;
