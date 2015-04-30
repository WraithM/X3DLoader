THREE.X3DLoader = function (manager) {

  this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

};

THREE.X3DLoader.prototype = {
  constructor: THREE.X3DLoader,

  load: function (url, onLoad, onProgress, onError) {
    var scope = this;

    var loader = new THREE.XHRLoader(scope.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.load( url, function (text) {

      onLoad(scope.parse(text));
    }, onProgress, onError);
  },

  parse: function (text) {
    console.time('X3DLoader');

    var scene = new THREE.Scene();

    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "text/xml");

    var parseNode = function (data, parent) {
      var object = parent;

      switch (data.tagName) {
        case 'Transform':
        case 'Group':
          object = new THREE.Object3D();

          // TODO If it's a definition, add to defines

          var translation = data.getAttribute('translation');
          var rotation = data.getAttribute('rotation');
          var scale = data.getAttribute('scale');

          if (translation) {
            var parts = translation.split(' ');
            parts = parts.map(function (s) { return parseFloat(s); });
            object.position.set(parts[0], parts[1], parts[2]);
          }

          if (rotation) {
            var parts = rotation.split(' ');
            parts = parts.map(function (s) { return parseFloat(s); });
            object.quaternion.setFromAxisAngle(new THREE.Vector3(parts[0], parts[1], parts[2]), parts[3]);
          }

          if (scale) {
            var parts = scale.split(' ');
            parts = parts.map(function (s) { return parseFloat(s); });
            object.scale.set(parts[0], parts[1], parts[2]);
          }

          parent.add(object);
          break;

        case 'Shape':
          console.log('Shape: ');
          console.log(data);
          object = new THREE.Mesh();

          // TODO If it's a definition, add to defines

          parent.add(object);
          break;

        case 'Background':
          console.log('Background: ');
          console.log(data);
          break;

        case 'Box':
          // TODO x3d has a Box property 'solid' which determines
          // if the box is visible from the inside.
          console.log(data);
          var sizes = data.getAttribute('size');
          if (sizes) {
            sizes = sizes.split(' ').map(function (s) { return parseFloat(s); });
            parent.geometry = new THREE.BoxGeometry(sizes[0], sizes[1], sizes[2]);
          } else {
            parent.geometry = new THREE.BoxGeometry(2, 2, 2);
          }
          break;
        case 'Cylinder':
          // TODO openEnded/top/bottom, segments
          console.log(data);
          var radius = 1;
          var radiusData = parseFloat(data.getAttribute('radius'));

          var height = 2; 
          var heightData = parseFloat(data.getAttribute('height'));

          if (radiusData) {
            radius = radiusData;
          }

          if (heightData) {
            height = heightData;
          }

          parent.geometry = new THREE.CylinderGeometry(radius, radius, height);
          break;
        case 'Cone':
          // TODO show bottom
          // TODO side
          // TODO solid
          console.log(data);
          var bottom = 1;
          var bottomData = parseFloat(data.getAttribute('bottom'));

          var height = 2;
          var heightData = parseFloat(data.getAttribute('height'));

          if (bottomData) {
            bottom = bottomData;
          }

          if (heightData) {
            height = heightData;
          }

          parent.geometry = new THREE.CylinderGeometry(0, bottom, height);
          break;
        case 'Sphere':
          // TODO x3d has a Sphere property 'solid' which determines
          // if the sphere is visible from the inside.
          var radius = parseFloat(data.getAttribute('radius'));
          if (radius) {
            parent.geometry = new THREE.SphereGeometry(radius, 32, 32);
          } else {
            parent.geometry = new THREE.SphereGeometry(1, 32, 32);
          }
          break;
        case 'Text':
          // TODO Parse FontStyle
          var textString = data.getAttribute('string');
          var textStrings = textString.match(/"(.*?)"/g);
          textStrings = textStrings.map(function (s) { return s.replace(/"/g,''); });

          var textGeometry = new THREE.Geometry();
          var translateNextLine = new THREE.Matrix4().makeTranslation(0, -1, 0);
          for (var i = 0; i < textStrings.length; i++) {
            var newText = new THREE.TextGeometry(textStrings[i], {size: 1, height: 0})

            if (i > 0) {
              newText.applyMatrix(translateNextLine);
              translateNextLine.multiply(translateNextLine);
            }

            textGeometry.merge(newText);
          }

          parent.geometry = textGeometry;
          break;
        case 'IndexedFaceSet':
          console.log(data);
          // TODO all of this
          break;
        case 'ElevationGrid':
          console.log(data);
          // TODO all of this
          break;
        case 'Extrusion':
          console.log(data);
          // TODO all of this
          break;

        case 'Appearance': break;
        case 'TwoSidedMaterial':
        case 'Material':
          //TODO Diffuse color
          //TODO Emissive color
          //TODO Specular color
          //TODO Transparency
          //TODO Ambient intensity
          //TODO Shininess
          console.log(data);
          break;
        case 'ImageTexture':
          console.log(data);
          var urlString = data.getAttribute('url');
          var urlStrings = urlString.match(/"(.*?)"/g);
          urlStrings = urlStrings.map(function (s) { return s.replace(/"/g,''); });

          var image;
          var i = 0;

          while (!image) {
            image = THREE.ImageUtils.loadTexture(urlStrings[i]);
            i++;
          }

          parent.material = new THREE.MeshBasicMaterial({ map: image });
          break;

        default:
          console.log('Unknown type: ' + data.tagName);
          console.log(data);
          break;
      }

      parseNodes(data.children, object);
    };

    var parseNodes = function (children, parent) {
      for (var i = 0; i < children.length; i++) {
        parseNode(children[i], parent);
      }
    }

    parseNodes(xmlDoc.getElementsByTagName("Scene")[0].children, scene);

    console.timeEnd('X3DLoader');

    return scene;
  }
};
