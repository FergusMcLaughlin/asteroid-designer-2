/***
 * Asteroid Designer (AC40001 Honours Project)
 * 
 * A Web based Gltf loader that uese PANGU to allow 
 * Users to edit asteroid models.
 * 
 * Fergus Mclaughlin (170015911), University of Dundee, 2022
 */


//Import the gltf loader, orbit controls and THREE
import * as THREE from "https://cdn.skypack.dev/three@0.133.0";
import { OrbitControls } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples/jsm/loaders/GLTFLoader.js";
import { DecalGeometry } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples//jsm/geometries/DecalGeometry.js";
import { LightProbeGenerator } from "https://cdn.skypack.dev/pin/three@v0.133.0-mRqtjW5H6POaf81d9bnr/mode=imports/unoptimized/examples/jsm/lights/LightProbeGenerator.js";
import GUI from "lil-gui";
import Stats from "../node_modules/stats-js/src/Stats";
import { saveDynamicDataToFile } from "./list_printer";


//Declare global variables
let renderer, scene, camera; 
let mesh, rockmesh;
let line, raycaster;
var axesHelper;

var Glat, Glng;
var choice = 1;
var place_size = 1;
var place_size2 = 1;
var place_mode = 0;
let rockID = 0;
const rockList = [];
let selectedObject = [];

var place_mode;
var StringTest;
var StringTest2;
let settings;
let mouseHelper;

const size = new THREE.Vector3(8, 8, 8);
const mouse = new THREE.Vector2();
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const intersects = [];

//Intersection point on the mesh
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
};

//Decal Paramiters
const params = {
    minScale: 10,
    maxScale: 100,
    rotate: true,
    clear: function () {
      removeDecals();
    },
  };

//Lighting
let lightProbe;
let directionalLight;
let ambientLight;

const light_Settings = {
  lightProbeIntensity: 1.0,
  directionalLightIntensity: 0.2,
  ambientLightIntensity: 1.0,
  directionalLightColour: 0xffffff,
  ambientLightColour: 0xffffff,
};

//fps/mbs logger
const stats = Stats({ autoPlace: false, width: 20 });
document.body.appendChild(stats.dom);
stats.domElement.style.cssText = "position: fixed; bottom: 0; right: 100;cursor:pointer;opacity:0.9;z-index:10000";



//==========================================================================================================================
//Initialisation Function for ThreeJS scene.
function Initialisation() {

    //Removes the file loading element
    document.getElementById("loaded").style.visibility = "hidden";
    document.getElementById("zone").style.visibility = "hidden";

    //loads GUI
    createPanel();

    // Renderer for the obejct contatiner.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;

     // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );
    camera.position.set(0, 0, 300);
    scene.add(camera);

    //Axis Helper
    axesHelper = new THREE.AxesHelper(2000);
    axesHelper.position.set(0, 0, 0);
    scene.add(axesHelper);
    axesHelper.visible = false;

    //Probe Light
    lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    //Directional Light
    directionalLight = new THREE.DirectionalLight(
        light_Settings.directionalLightColour,
        light_Settings.directionalLightIntensity
    );
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    //Ambiant Light
    ambientLight = new THREE.AmbientLight(
        light_Settings.ambientLightColour, 
        light_Settings.ambientLightIntensity
        );
    scene.add(ambientLight);

    //Mouse Helper Settings

    //Buffer Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

    //Helper Line
    line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xffff00 })
    );
    scene.add(line);

    const raycaster = new THREE.Raycaster(); //raycast for the model
    const pointer = new THREE.Vector2(); // where the mouse is in screen space

    // Mouse Helper
    mouseHelper = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 10),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
      );
      mouseHelper.visible = true;
      scene.add(mouseHelper);

    //Camera Controls Parameters
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", Animation);

    controls.minDistance = 100;
    controls.maxDistance = 2000;
    controls.enablePan = false;

    // Call the loader function.
    GLTF_Loader(); 

    

//==========================================================================================================================
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
//==========================================================================================================================
    //Event Listners
    window.addEventListener("resize", Window_Resize);
    let moved = false;
    

    controls.addEventListener("change", function () {
    moved = true;
    });

    window.addEventListener("pointerdown", function () {
    moved = false;
    });

//==========================================================================================================================
    //Place On Shift Click
    window.addEventListener("pointerup", function (event) {

        if (event.shiftKey) {
            if (moved === false) {

                Check_Intersection(event.clientX, event.clientY); //Check It's Hit
                //Place Crater
                if (intersection.intersects && place_mode == 1) { 

                position.copy(intersection.point);
                orientation.copy(mouseHelper.rotation);
                
                if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

                const scale = place_size2 + 10;
                size.set(scale, scale, scale);

                const texture = new THREE.TextureLoader().load( 'images/marker_mask5.png' );

                const material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    map: texture,
                    alphaTest: 0.5,
                  });

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
                  scene.add(m);
                
                Coordinates_Converter(); // convert X,Y,Z to Lng And Lat

                settings.X_Coordinate = mouseHelper.position.x; //Update Placement Info
                settings.Y_Coordinate = mouseHelper.position.y;
                settings.Z_Coordinate = mouseHelper.position.z;
                settings.Latitude = Glat;
                settings.Longitude = Glng;

                }

                //Place Rock
                else if (intersection.intersects && place_mode == 0) {

                    const loader = new GLTFLoader();
                    var rockID = 0;

                    loader.load("models/Bennu_1_1.glb", function (gltf) { //load rock model
                        rockmesh = gltf.scene.children[0];
                        const uuid = rockmesh.uuid; // Add Unique Identifier

                        rockList[uuid] = {
                            model: gltf,
                            mydata: {
                              userPlaced: true,
                            },
                          };
                        rockID = uuid;

                        //Place at Mouse Intersection Position
                        rockmesh.position.set( 
                            mouseHelper.position.x,
                            mouseHelper.position.y,
                            mouseHelper.position.z
                          );

                        rockmesh.material = new THREE.MeshBasicMaterial({
                            color: 0xffff00,
                            wireframe: false,
                            opacity: 0.5,
                            transparent: true,
                        });
                        rockmesh.material.opacity = 0.5;

                        //Set Rock User Data
                        rockmesh.userData.draggable = true;
                        rockmesh.userData.moved = false;
                        rockmesh.userData.asteroid = false;

                        scene.add(rockmesh);

                        rockmesh.scale.set(
                            place_size / 100,
                            place_size / 100,
                            place_size / 100
                          );

                        console.log(rockmesh.uuid, "  :  ", Glng, " , ", Glat);

                    });

                    Coordinates_Converter(); // convert X,Y,Z to Lng And Lat

                    settings.X_Coordinate = mouseHelper.position.x; //Update Placement Info
                    settings.Y_Coordinate = mouseHelper.position.y;
                    settings.Z_Coordinate = mouseHelper.position.z;
                    settings.Latitude = Glat;
                    settings.Longitude = Glng;
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


/**
 * converts a XYZ THREE.Vector3 to longitude latitude. beware, the vector3 will be normalized!
 * @param vector3
 * @returns an array containing the longitude [0] & the lattitude [1] of the Vector3
 * from https://gist.github.com/nicoptere/2f2571db4b454bb18cd9
 */
const BufferPosition = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

function Coordinates_Converter() {
  const cube = new THREE.Mesh(BufferPosition, material2);
  // cube.userData.asteroid = true;
  cube.position.set(
    mouseHelper.position.x,
    mouseHelper.position.y,
    mouseHelper.position.z
  );
  scene.add(cube);

  cube.position.normalize(); // removes decimal places for the vector

  // console.log(cube.position.x, cube.position.y, cube.position.z);
  //longitude = angle of the vector around the Y axis
  //-( ) : negate to flip the longitude (3d space specific )
  //- PI / 2 to face the Z axis
  var lng = -Math.atan2(-cube.position.z, -cube.position.x) - Math.PI / 2;

  //to bind between -PI / PI
  if (lng < -Math.PI) lng += Math.PI * 2;

  //latitude : angle between the vector & the vector projected on the XZ plane on a unit sphere

  //project on the XZ plane
  var p = new THREE.Vector3(cube.position.x, 0, cube.position.z);
  //project on the unit sphere
  p.normalize();

  //commpute the angle ( both vectors are normalized, no division by the sum of lengths )
  var lat = Math.acos(p.dot(cube.position));

  //invert if Y is negative to ensure teh latitude is comprised between -PI/2 & PI / 2
  if (cube.position.y < 0) lat *= -1;

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

//loads fiels in a gltf format
function GLTF_Loader() {
  const loader = new GLTFLoader();

  loader.parse(obj, "", (gltf) => {
    mesh = gltf.scene.children[0];

    scene.add(mesh);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.userData.asteroid = true;

    mesh.traverse((child) => {
      //   console.log("element: ", child.name, child.scale);
    });
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

//Updates on Window Resize
function Window_Resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  Animation();
}

//document.getElementById('Tool_Bar').appendChild(document.getElementById('stats.dom'));

//Animation function
function Animation() {
  dragObject();
  requestAnimationFrame(Animation);

  renderer.render(scene, camera);
  stats.update();
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
/*
function addSelectedObject( object ) {

  selectedObject = [];
  selectedObject.push( object );

}
*/
window.addEventListener(
  "contextmenu",
  function (event) {
    //locationUpdater();
    //make a non selected rock light again

    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rockRaycaster.setFromCamera(clickMouse, camera);
    const found = rockRaycaster.intersectObjects(scene.children, true);
    //  console.log("rightclick");

    if (draggable) {
      //     console.log("Dropping :  " + rockID);
      if (found[0].object.userData.moved == true) {
        found[0].object.material.opacity = 0.5;
      }
      //found[0].object.userData.moved = true;
      draggable = null;

      return;
    }

    if (found.length > 0 && found[0].object.userData.draggable) {
      draggable = found[0].object;
      found[0].object.material.opacity = 0.9;
      found[0].object.userData.moved = true;
      /*
      const sObject = found[ 0 ].object;
						addSelectedObject( sObject );
						outlinePass.selectedObjects = selectedObject;
      */
      console.log(
        found[0].object.uuid,
        " : Has been moved"
        // found[0].object.userData.moved
      );
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
          draggable.position.x = mouseHelper.position.x;
          draggable.position.y = mouseHelper.position.y;
          draggable.position.z = mouseHelper.position.z;

          /*
          draggable.position.x = o.point.x;
          draggable.position.y = o.point.y;
          draggable.position.z = o.point.z;
          */
        }
      }
    }
  }
}

window.locationUpdater = function () {
  scene.traverse(function (obj) {
    if (obj.userData.asteroid == false) {
      obj.position.normalize();

      //  console.log(obj.position.x, obj.position.y, obj.position.z);

      var lng = -Math.atan2(-obj.position.z, -obj.position.x) - Math.PI / 2;

      if (lng < -Math.PI) lng += Math.PI * 2;

      var p = new THREE.Vector3(obj.position.x, 0, obj.position.z);

      p.normalize();

      var lat = Math.acos(p.dot(obj.position));

      if (obj.position.y < 0) lat *= -1;

      lat = (lat * 180.0) / Math.PI;
      lng = (lng * 180.0) / Math.PI;

      if (lng < 0) {
        lng = lng + 360;
      }

      console.log(obj.uuid, "  :  ", lat, " , ", lng);

      list.insertFirst(obj.uuid, 1, lat, lng, 40, 0, 1);
    }
  });

  saveDynamicDataToFile();
};

//Size checker(toggle box)
const boundsBox = new THREE.Box3();
const helper = new THREE.Box3Helper(boundsBox, 0xffff00);
var Osize;
function sizeCheck() {
  boundsBox.setFromObject(mesh, true);

  scene.add(helper);
  //console.log(helper.scale.x + "  " + helper.scale.y + "  " + helper.scale.z);

  //console.log();
  scene.remove(helper);
}

var xcoord = "N/A";
var ycoord = "N/A";
var zcoord = "N/A";
var Nlat = "N/A";
var Nlng = "N/A";

function createPanel() {
  const panel = new GUI({ width: 310 });

  const folder1 = panel.addFolder("Placement Tools");
  const folder2 = panel.addFolder("Placement Information");
  const folder3 = panel.addFolder("Scene Options");

  const folder4 = panel.addFolder("Save Changes");

  settings = {
    'Wireframe': false,
    'AxesHelper': false,
    'Export Lists': exportLists,
    "Rock Size": 1,
    "Crater Size": 1,
    "Object Type": "Rock",
    //Placement Info
    'X_Coordinate': xcoord,
    'Y_Coordinate': ycoord,
    'Z_Coordinate': zcoord,
    'Latitude': Nlat,
    'Longitude': Nlng,
    //colours
    'Background_Colour': "rgb(0,0,0)",
    'Ambient_Light': 1.5,
    'Direct_Light': 1.5,
    'Probe_Light': 1.5,
    'Ambient_Colour': "rgb(255,255,255)",
    'Direct_Colour': "rgb(255,255,255)",
  };

  folder1.add(settings, "Wireframe").onChange(modelWireframe);
  folder1.add(settings, "AxesHelper").onChange(axisHelper);
  folder1.add(settings, "Rock Size", 1.0, 10.0, 1.0).onChange(sizeSlider);
  folder1.add(settings, "Crater Size", 1.0, 40.0, 1.0).onChange(sizeSlider2);
  folder1.add(settings, "Object Type", ["Rock", "Crater"]).onChange(TypePicker);


  folder2.add(settings, "X_Coordinate").listen().disable();
  folder2.add(settings, "Y_Coordinate").listen().disable();
  folder2.add(settings, "Z_Coordinate").listen().disable();
  folder2.add(settings, "Latitude").listen().disable();
  folder2.add(settings, "Longitude").listen().disable();

  folder3.addColor(settings, "Background_Colour").onChange(BackGroundColour);
  folder3.add(settings, "Ambient_Light", 0, 1, 0.02).onChange(lightUpdater);
  folder3.add(settings, "Direct_Light", 0, 1, 0.02).onChange(lightUpdater);
  folder3.add(settings, "Probe_Light", 0, 1, 0.02 ).onChange(lightUpdater);
  folder3.addColor(settings, "Ambient_Colour").onChange(lightColourUpdater);
  folder3.addColor(settings, "Direct_Colour").onChange(lightColourUpdater);

  folder4.add(settings, "Export Lists");
  function modelWireframe(choice) {
    mesh.material.wireframe = choice;
  }

  function exportLists() {
    locationUpdater();
  }
  function sizeSlider(rockSize) {
    place_size = rockSize;
  }
  function sizeSlider2(craterSize) {
    place_size2 = craterSize;
  }
  function TypePicker(placeType) {
    if (placeType == "Rock") place_mode = 0;
    else place_mode = 1;
  }
  function BackGroundColour() {
    scene.background = new THREE.Color(settings.Background_Colour);
  }

  function axisHelper(choice) {
    // var AxischeckBox = document.getElementById("axis");

    if (choice == true) {
      axesHelper.visible = true;
    } else {
      axesHelper.visible = false;
    }
  }
  function lightUpdater() {
    lightProbe.intensity = settings.Probe_Light; Animation();
    directionalLight.intensity = settings.Direct_Light; Animation();
    ambientLight.intensity = settings.Ambient_Light; Animation();

  }

  function lightColourUpdater() {

    directionalLight.color = new THREE.Color(settings.Direct_Colour);
    ambientLight.color = new THREE.Color(settings.Ambient_Colour);

  }

  folder3.close();
}