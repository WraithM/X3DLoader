var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var gridmat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
var gridgeom = new THREE.Geometry();
for (var i = -500; i <= 500; i += 5) {
  gridgeom.vertices.push(new THREE.Vector3(-500, 0, i));
  gridgeom.vertices.push(new THREE.Vector3(500, 0, i));
  gridgeom.vertices.push(new THREE.Vector3(i, 0, -500));
  gridgeom.vertices.push(new THREE.Vector3(i, 0, 500));
}
var grid = new THREE.Line(gridgeom, gridmat);

var ambient = new THREE.AmbientLight(0x101030);
var directional = new THREE.DirectionalLight(0xffeedd);
directional.position.set(0,0,5);

var loader = new THREE.X3DLoader();
var helloworld;
loader.load('HelloWorld.x3d', function (object) {
  helloworld = object;

  object.position.y += 10;

  scene.add(object);
});

scene.add(ambient);
scene.add(directional);
scene.add(grid);

camera.position.z = 5;
camera.position.y = 5;

var controls = new PointerLockControl(camera);

var havePointerLock 
      =  'pointerLockElement' in document 
      || 'mozPointerLockElement' in document 
      || 'webkitPointerLockElement' in document;

if (havePointerLock) {
  var element = document.body;

  var pointerlockchange = function (event) {
    if (document.pointerLockElement === element 
        || document.mozPointerLockElement === element 
        || document.webkitPointerLockElement === element) {
      controls.enabled = true;
      console.log('Pointer lock enabled.');
    } else {
      controls.enabled = false;
      console.log('Pointer lock disabled!');
    }
  }

  var pointerlockerror = function (event) {
    console.log('Pointer lock disabled.');
  }

  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

  document.addEventListener('pointerlockerror', pointerlockerror, false);
  document.addEventListener('mozpointerlockerror', pointerlockerror, false);
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

  document.body.addEventListener('click', function (event) {
    element.requestPointerLock = 
      element.requestPointerLock 
      || element.mozRequestPointerLock
      || element.webkitRequestPointerLock;

    element.requestPointerLock();
  }, false);
}

window.onresize = function (event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function render() {
  requestAnimationFrame(render);
  controls.update();

  helloworld.rotation.y += 0.01;

  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

render();
