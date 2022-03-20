


const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function(e) {

    console.log(input.files)
    const reader = new FileReader();

    reader.onload = function () {      
        obj = reader.result;
        console.log(obj);
    }

    reader.readAsArrayBuffer(input.files[0]);


},false)

function GLTF_Loader() {
    const loader = new GLTFLoader();
   // console.log(threeObject);
    loader.load("models/Itokawa_1_1.glb", function (gltf) { 
    mesh = gltf.scene.children[0];
  
  
      scene.add(mesh);
      mesh.scale.set(0.4, 0.4, 0.4);
      //This is different to the gltf loader used in the heat map.
    });
  }


