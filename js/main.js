/* 
Asteroid Editor Prototype
Sections taken from the Three.js examples.
*/

//Import the gltf loader, orbit controls and THREE
import * as THREE from "https://cdn.skypack.dev/three@0.133.0";
import { OrbitControls } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples/jsm/loaders/GLTFLoader.js";
import { DecalGeometry } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples//jsm/geometries/DecalGeometry.js";

/*
                TODO
move the file saveing stuff in here after 
I get the intersectiopn point printing out
*/

document.body.style.cursor = "none !important";
//Declare global variables
let renderer, scene, camera; //scene variables
//added -
let mesh;
let rockmesh;
let raycaster;
let line;

var Glat;
var Glng;
var choice = 1;
var place_size;

//Testing
var place_mode;
var IDcount;
var StringTest;
var StringTest2;
var StringBuffer;

//export {StringTest as StringTest}; // export IDS without
export { StringTest2 as StringTest2 };
export { StringTest as StringTest };

//intersection point on the mesh
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
};

const mouse = new THREE.Vector2();
const intersects = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();

const size = new THREE.Vector3(8, 8, 8);
const params = {
  minScale: 10,
  maxScale: 100,
  rotate: true,
  clear: function () {
    removeDecals();
  },
};

//Initialisation(); //run initialisation function

/*
function Mode_Update(){
  filter.addEventListener('change', filterChanged);
  var choice = document.getElementById("modepicker");
  var place_mode = choice.value;
  console.log(choice);
}
*/

window.Mode_Update = function () {
  filter.addEventListener("change", filterChanged);
  var choice = document.getElementById("modepicker");
  var place_mode = choice.value;
  console.log(choice);
};

window.onload = function () {
  choice = document.getElementById("modepicker");
  console.log(choice);
};

//changes the range slider number
window.rangeSlide = function (value) {
  document.getElementById("rangeValue").innerHTML = value;
  place_size = value;
  console.log(place_size);
};

window.printList = function (StringTest) {
  document.getElementById("Coord_List").value = StringTest;
};
window.axisHelper = function () {
  var AxischeckBox = document.getElementById("axis");

  if (AxischeckBox.checked == true) {
    const axesHelper = new THREE.AxesHelper(250);
    axesHelper.position.set(0, 0, 0);
    scene.add(axesHelper);
  } else if (AxischeckBox.checked == false) {
    scene.remove(axesHelper); // why is this not working
  }
};
window.boundsBoxView = function () {
  var BoundscheckBox = document.getElementById("box");
  if (BoundscheckBox.checked == true) {
    scene.add(helper);
    console.log("wooooooooo");
  } else {
    scene.remove(helper);
  }
};

window.reload = function () {
  Initialisation();
};

function Initialisation() {
  //choice = document.getElementById('newone');
  console.log(choice);

  // Renderer for the actual obejct contatiner.
  renderer = new THREE.WebGLRenderer();
  /*
    TODO:
    the mouse hovers above the pointer, I think this is due to the script being ran in a lower <body> and not full screen.
    Something like this :
    const bounds = canvas.getBoundingClientRect()
    const mouseX = mouse.x - bounds.left
*/
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  document.body.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 300);
  scene.add(camera);

  // Geometry
  // TODO : I think this is to help in drawing the line but I need look at this currently it just works
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

  // Line
  // Add the line marker for the mouse
  //TODO: hide the currsor when you are on the body containing the model as it gets confusing.
  line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0xffff00 })
  );
  scene.add(line);

  const raycaster = new THREE.Raycaster(); //raycast for the model
  const pointer = new THREE.Vector2(); // where the mouse is in screen space*

  // Mouse Helper
  // This was used in the Decal example It makes sure the intersection postion from the mouse is more uniform.
  // it places a box object at the intersection point, currently set to not visable is im not sure its needed.
  mouseHelper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 10),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  //mouseHelper.setColor(0xFFFFFF);
  mouseHelper.visible = true;
  scene.add(mouseHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", Animation);
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  controls.enablePan = false;

  // Lighting
  // TODO: need to change this.
  const light = new THREE.PointLight(0xffffff, 1.5);
  camera.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.2)); // ambient

  //loads the model this is okay for prototype purposes but will need to be dynamic and probably enterned by the user.
  // let model = "models/Vesta_1_100.glb";
  GLTF_Loader(); // Call the loader function.

  const axesHelper = new THREE.AxesHelper(250);
  axesHelper.position.set(0, 0, 0);
  scene.add(axesHelper);
  scene.remove(axesHelper);

  //Intersection check function
  function Check_Intersection(x, y) {
    //Checks there is a mesh.
    if (mesh === undefined) return;

    //Gets the mouse x and y based on the window.
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    mouse.x - renderer.left;

    // Raycasts line from mouse in the 3d space.
    raycaster.setFromCamera(mouse, camera);

    //.intersectObject ( object : Object3D, recursive : Boolean, optionalTarget : Array )
    raycaster.intersectObject(mesh, false, intersects);

    if (intersects.length > 0) {
      // If the target is greater than 0.
      const p = intersects[0].point;
      mouseHelper.position.copy(p); // Copies the the box postition to p.
      intersection.point.copy(p); // Copies the the intersection point postition to p.

      const n = intersects[0].face.normal.clone(); // Clones the face noramls of the intersect point into n.
      n.transformDirection(mesh.matrixWorld); // Transform of the object.
      n.multiplyScalar(10); // Multiply by 10.
      n.add(intersects[0].point); // Add as a child.

      intersection.normal.copy(intersects[0].face.normal);
      mouseHelper.lookAt(n); //n is the world space for the helper box.

      const positions = line.geometry.attributes.position; //move the line position
      positions.setXYZ(0, p.x, p.y, p.z);
      positions.setXYZ(1, n.x, n.y, n.z);
      positions.needsUpdate = true;

      intersection.intersects = true;
      intersects.length = 0;
    } else {
      intersection.intersects = false;
    }
  }
  window.addEventListener("resize", Window_Resize);

  let moved = false;
  controls.addEventListener("change", function () {
    moved = true;
  });

  window.addEventListener("pointerdown", function () {
    moved = false;
  });

  window.addEventListener("pointerup", function (event) {
    // console.log(mouse.x, ", ", mouse.y);
    if (event.shiftKey) {
      if (moved === false) {
        Check_Intersection(event.clientX, event.clientY);
        if (intersection.intersects && choice.value == 1) {
          //&& choice.value == 1) {
          // console.log(mouseHelper.position);
          place();

          document.getElementById("mX").value = mouseHelper.position.x;
          document.getElementById("mY").value = mouseHelper.position.y;
          document.getElementById("mZ").value = mouseHelper.position.z;

          document.getElementById("mLAT").value = Glat;
          document.getElementById("mLNG").value = Glng;

          //   document.getElementById("List").value = StringTest2;

          list.insertFirst(2, Glat, Glng, 40, 0, 1);
          console.log(StringTest2);

          Coordinates_Converter();
        } else if (intersection.intersects && choice.value == 0) {
          // console.log(mouseHelper.position);
          place_rock();

          document.getElementById("mX").value = mouseHelper.position.x;
          document.getElementById("mY").value = mouseHelper.position.y;
          document.getElementById("mZ").value = mouseHelper.position.z;

          document.getElementById("mLAT").value = Glat;
          document.getElementById("mLNG").value = Glng;

          // document.getElementById("List").value = StringTest;

          //add to list
          list.insertFirst(rockID, 1, Glat, Glng, 40, 0, 1);
          console.log(rockID);

          //listTest();

          // console.log(StringTest);

          // currently not working with spheres possibly to do with the normilisation process ?
          //works when moced into the place rock function
        }
      }
    }
  });

  window.addEventListener("pointermove", onPointerMove);

  function onPointerMove(event) {
    if (event.isPrimary) {
      Check_Intersection(event.clientX, event.clientY);
    }
  }
  Animation();

  window.addEventListener("resize", Window_Resize);
}

//loads fiels in a gltf format
function GLTF_Loader() {
  const loader = new GLTFLoader();

  loader.parse(obj, "", (gltf) => {
    mesh = gltf.scene.children[0];

    scene.add(mesh);

    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.userData.asteroid = true;
  });
}

function place() {
  position.copy(intersection.point);
  orientation.copy(mouseHelper.rotation);

  if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

  const scale = place_size + 0.02;
  size.set(scale, scale, scale);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    map: THREE.ImageUtils.loadTexture("images/marker_mask5.png"),
    //opacity: 0.5,
    //transparent: true,
    alphaTest: 0.5,
  });

  //material.color.setHex( 0xfc0303 );

  //This stuff stops the z fighting.
  material.polygonOffset = true;
  material.depthTest = true;
  material.polygonOffsetFactor = -4;
  material.polygonOffsetUnits = 0.1;

  const m = new THREE.Mesh(
    new DecalGeometry(mesh, position, orientation, size),
    material
  );
  m.userData.draggable = true;
  //  const m = new THREE.Mesh( new THREE.BoxGeometry( 100,100,100), new THREE.MeshNormalMaterial());
  // m.position.set(position);
  // decals.push( m );
  scene.add(m);
  console.log(m.scale);
}
var rockID = 0;
const rockList = [];
function place_rock() {
  const loader = new GLTFLoader();
  loader.load("models/Bennu_1_1.glb", function (gltf) {
    rockmesh = gltf.scene.children[0];

    // position.copy(intersection.point);
    // orientation.copy(mouseHelper.rotation);

    //rockmesh.position.set(intersection.point);
    rockmesh.position.set(
      mouseHelper.position.x,
      mouseHelper.position.y,
      mouseHelper.position.z
    );
    // if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;
    // rockmesh.orientation.set(mouseHelper.rotation);
    //position.copy(intersection.point);
    //orientation.copy(mouseHelper.rotation);
    rockmesh.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: false,
      opacity: 0.5,
      transparent: true,
    });
    rockmesh.material.opacity = 0.5;
    scene.add(rockmesh);

    rockmesh.scale.set(place_size / 100, place_size / 100, place_size / 100);

    const uuid = rockmesh.uuid;

    rockList[uuid] = {
      model: gltf,
      mydata: {
        //place: holder,
      },
    };
    rockmesh.userData.draggable = true;
    rockID = uuid;
    Coordinates_Converter();
    sizeCheck();
  });
}

//Updates on Window Resize
function Window_Resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  Animation();
}

//Animation function
function Animation() {
  dragObject();
  requestAnimationFrame(Animation);
  renderer.render(scene, camera);
}

/**
 * converts a XYZ THREE.Vector3 to longitude latitude. beware, the vector3 will be normalized!
 * @param vector3
 * @returns an array containing the longitude [0] & the lattitude [1] of the Vector3
 * from https://gist.github.com/nicoptere/2f2571db4b454bb18cd9
 */
function Coordinates_Converter() {
  mouseHelper.position.normalize(); // removes decimal places for the vector

  //longitude = angle of the vector around the Y axis
  //-( ) : negate to flip the longitude (3d space specific )
  //- PI / 2 to face the Z axis
  var lng =
    -Math.atan2(-mouseHelper.position.z, -mouseHelper.position.x) - Math.PI / 2;

  //to bind between -PI / PI
  if (lng < -Math.PI) lng += Math.PI * 2;

  //latitude : angle between the vector & the vector projected on the XZ plane on a unit sphere

  //project on the XZ plane
  var p = new THREE.Vector3(mouseHelper.position.x, 0, mouseHelper.position.z);
  //project on the unit sphere
  p.normalize();

  //commpute the angle ( both vectors are normalized, no division by the sum of lengths )
  var lat = Math.acos(p.dot(mouseHelper.position));

  //invert if Y is negative to ensure teh latitude is comprised between -PI/2 & PI / 2
  if (mouseHelper.position.y < 0) lat *= -1;

  //Convert from raidains to degtrees
  lat = (lat * 180.0) / Math.PI;
  lng = (lng * 180.0) / Math.PI;

  if (lng < 0) {
    //corrects the lng not letting it become a minus num
    lng = lng + 360;
  }

  Glat = lat;
  Glng = lng;

  //document.getElementById("mLNG").value = Glng;
  //document.getElementById("mLAT").value = Glat;
  console.log("long and lat : ", lng, lat);

  return [lng, lat];
}

var obj;
var threeObject;

const input = document.querySelector('input[type="file"]');
input.addEventListener(
  "change",
  function (e) {
    console.log(input.files);
    const reader = new FileReader();

    reader.onload = function () {
      obj = reader.result;
      threeObject = URL.createObjectURL(input.files[0]);
      console.log(obj);
      console.log(threeObject);
      Initialisation();
    };

    reader.readAsArrayBuffer(input.files[0]);
  },
  false
);

//Click and Drag Ray cast

const rockRaycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
var draggable = new THREE.Object3D();

window.addEventListener(
  "contextmenu",
  function (event) {
    //make a non selected rock light again

    console.log("rightclick");
    if (draggable) {
      console.log("Dropping :  " + rockID);
      draggable = null;

      return;
    }

    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rockRaycaster.setFromCamera(clickMouse, camera);
    const found = rockRaycaster.intersectObjects(scene.children);
    if (found.length > 0 && found[0].object.userData.draggable) {
      draggable = found[0].object;
      found[0].object.material.opacity = 1;
      console.log("found draggable rock : " + rockID);
    }
  },
  false
);

window.addEventListener(mouseMove, (event) => {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

//try match this up to the helper ??
function dragObject() {
  if (draggable != null) {
    rockRaycaster.setFromCamera(mouseMove, camera);
    const found = rockRaycaster.intersectObjects(scene.children);
    if (found.length > 0) {
      for (let o of found) {
        if (!o.object.userData.asteroid) {
          continue;
        } else {
          draggable.position.x = o.point.x;
          draggable.position.y = o.point.y;
          draggable.position.z = o.point.z;
          /*
        draggable.position.x = mouseHelper.position.x;
        draggable.position.y = mouseHelper.position.y;
        draggable.position.z = mouseHelper.position.z;
*/
        }
      }
    }
  }
}

//Size checker(toggle box)
const boundsBox = new THREE.Box3();
const helper = new THREE.Box3Helper(boundsBox, 0xffff00);

function sizeCheck() {
  boundsBox.setFromObject(mesh, true);
  console.log(boundsBox.min + "  " + boundsBox.max);
  scene.add(helper);
  console.log(helper.scale.x + "  " + helper.scale.y + "  " + helper.scale.z);
  scene.remove(helper);
}
//check box for axis guids
