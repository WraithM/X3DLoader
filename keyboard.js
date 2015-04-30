// Keyboard constructor
Keyboard = function () {
  document.addEventListener("keydown", Keyboard.onKeyDown, false);
  document.addEventListener("keyup", Keyboard.onKeyUp, false);
}

// Status is empty initially
Keyboard.status = {};

Keyboard.onKeyUp = function (event) {
  var key = String.fromCharCode(event.keyCode);

  if (Keyboard.status[key])
    Keyboard.status[key].pressed = false;
}

Keyboard.onKeyDown = function (event) {
  var key = String.fromCharCode(event.keyCode);

  if (!Keyboard.status[key]) {
    Keyboard.status[key] = {
      down: false,
      pressed: false,
      up: false,
      updatedPreviously: false
    };
  }
}

Keyboard.prototype.update = function () {
  for (var key in Keyboard.status) {
    var keyStatus = Keyboard.status[key];
    if (!keyStatus.updatedPreviously) {
      keyStatus.down = true;
      keyStatus.pressed = true;
      keyStatus.updatedPreviously = true;
    } else {
      keyStatus.down = false;
    }
    
    if (keyStatus.up) {
      delete Keyboard.status[key];
      continue;
    }

    if (!keyStatus.pressed) {
      keyStatus.up = true;
    }
  }
}

Keyboard.prototype.down = function (key) {
  var keyStatus = Keyboard.status[key];
  return (keyStatus && keyStatus.down);
}

Keyboard.prototype.up = function (key) {
  var keyStatus = Keyboard.status[key];
  return (keyStatus && keyStatus.up);
}

Keyboard.prototype.pressed = function (key) {
  var keyStatus = Keyboard.status[key];
  return (keyStatus && keyStatus.pressed);
}

Keyboard.prototype.debug = function () {
  for (var key in Keyboard.status) {
    var keyStatus = Keyboard.status[key];
    console.log('Key ' + key + ' ' + keyStatus.up + ' ' + keyStatus.down + ' ' + keyStatus.pressed);
  }
}
