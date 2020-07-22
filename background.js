

triangleslist=[];
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

color=[0xe1471d,0xdf4621,0xe4441a,0xe46120,0xe1461e,0xe89025,0xe8631e,0xe1461e,0xe3631a,0xe6ba06,
  0xeda114,0xe99908,0xf09906,0xf08e10,0xe8ca0a,0xeca00d,0xea8715,0xef9914,0xea9512,0xf17a0b,0xe96f18,
  0xe7821f,0xf1b813,0xeca312,0xedab0f,
  0xeca20a,0xf5c516,0xe6a902,0xe68b15,
  0xe98c1c,0xee9f0a,0xe68b15,
  0xf09a0f,0xea9f19,0xefaa26,0xea9915,
  0xef7917,0xe97f09,0xeb8f1b,0xdf8018,0xe68518,0xe4621e,0xea8c16,0xed9912,0xeb7e13,0xe99313];


var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function InitialiseScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 0;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function addLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}


function createTriangles(){
  geometry= new THREE.Geometry();

  geometry.vertices.push( new THREE.Vector3(randomNumber(-100,100),0,0));
  geometry.vertices.push( new THREE.Vector3(0,randomNumber(-100,100),0));
  geometry.vertices.push( new THREE.Vector3(0,0,randomNumber(-100,100)));
  geometry.vertices.push( new THREE.Vector3(0,0,0));

  geometry.faces.push(new THREE.Face3(0,1,2));
  geometry.faces.push(new THREE.Face3(1,2,3));
  geometry.faces.push(new THREE.Face3(0,2,3));
   geometry.faces.push(new THREE.Face3(0,3,1));


      mat = new THREE.MeshBasicMaterial({
    color:color[Math.floor(Math.random() * color.length)],
    transparent:true,
    opacity:1,
    flatShading:true,
     side: THREE.DoubleSide,
     wireframe:true
});
shape=new THREE.Mesh(geometry,mat);
triangleslist.push(shape);

}
function createBackground(){
  group= new THREE.Group();
  for(i=0;i<40;i++){
    createTriangles();
  }
  for(i=0;i<40;i++){
    triangleslist[i].position.x=200*Math.cos(i);
    triangleslist[i].position.y=200*Math.sin(i);

    group.add(triangleslist[i]);
  }
  for (i=0;i<10;i++){
    x=getRandomInt(20)
  triangleslist[x].material.wireframe=false;
  triangleslist[x].material.opacity=0.3;
  }
  scene.add(group);
}

function loop(){
  triangleslist.forEach((item, i) => {
    item.rotation.x+=0.008;
   item.rotation.z+=0.008;
  });
  group.rotation.x+=0.3;
  group.rotation.z+=0.3;
  group.rotation.y+=0.3;
  updatebackground(0.01);//change for mouse responce movement

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function  updatebackground(x){
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  group.rotation.x=x*-targetX;
  group.rotation.y=x*-targetY;
  group.rotation.z=x*-targetY;

}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
   InitialiseScene();
   addLights();
   createBackground();
   loop();

}

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};


}

window.addEventListener('load', init, false);
