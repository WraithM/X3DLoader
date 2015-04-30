PointerLockControl = function (camera) {
  var scope = this;

  var MOUSESPEED = 10;

  var onMouseMove = function (event) {
    if (scope.enabled === false) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementY || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    var oldlat = scope.lat;

    scope.lon += movementX;
    scope.lat -= movementY;

    var phi = (90 - scope.lat) * Math.PI / 180;
    var theta = scope.lon * Math.PI / 180;

    if (phi >= 3 * Math.PI / 4 || phi <= Math.PI / 4) {
      scope.lat = oldlat;
    }

    scope.target.x = camera.position.x + MOUSESPEED * Math.sin(phi) * Math.cos(theta);
    scope.target.y = camera.position.y + MOUSESPEED * Math.cos(phi);
    scope.target.z = camera.position.z + MOUSESPEED * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(scope.target);
  };

  document.addEventListener('mousemove', onMouseMove, false);

  this.enabled = false;

  this.keyboard = new Keyboard();
  this.camera = camera;

  this.lon = 0;
  this.lat = 0;

  this.target = new THREE.Vector3(0, 0, 0);
}

PointerLockControl.prototype.update = function () {
  var SPEED = 0.01;

  var keyboard = this.keyboard;
  var camera = this.camera;
  var target = this.target;

  keyboard.update();

  var fwd = new THREE.Vector3();
  fwd.subVectors(target, camera.position);

  if (keyboard.pressed("W")) {
    camera.position.x += SPEED * fwd.x;
    camera.position.z += SPEED * fwd.z;

    target.x += SPEED * fwd.x;
    target.z += SPEED * fwd.z;
  }

  if (keyboard.pressed("S")) {
    camera.position.x -= SPEED * fwd.x;
    camera.position.z -= SPEED * fwd.z;

    target.x -= SPEED * fwd.x;
    target.z -= SPEED * fwd.z;
  }

  if (keyboard.pressed("A")) {
    camera.position.x += SPEED * fwd.z;
    camera.position.z -= SPEED * fwd.x;

    target.x += SPEED * fwd.z;
    target.z -= SPEED * fwd.x;
  }

  if (keyboard.pressed("D")) {
    camera.position.x -= SPEED * fwd.z;
    camera.position.z += SPEED * fwd.x;

    target.x -= SPEED * fwd.z;
    target.z += SPEED * fwd.x;
  }

  if (keyboard.down("R")) {
    camera.position.set(0, 5, 5);
  }
}

PointerLockControl.prototype.getTarget = function () {
  return this.target;
}
