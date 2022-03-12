/*
TODO
check file type
check one file has been uploaded

*/

var modelfile;

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  //event listners
  //brings up file slelection on click
  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });
//updates after file picked from explorer
  inputElement.addEventListener("change",e => {
      if (inputElement.files.length) {
          updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
  } );
  //changes when a file is dragged over
  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault(); //stops the browser trying to open the file
    dropZoneElement.classList.add("drop-zone--over");
  });

  //ran if its outside of the drop zone or the drag has been cancled.
  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  //when the file is dropped
  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();
    //console.log(e.dataTransfer.files);
    if (e.dataTransfer.files.length) {
      //look at this to make sure only one model has been uploaded or just use one
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      const threeObject = URL.createObjectURL(e.dataTransfer.files[0]);  // `URL` is globally available
      console.log(threeObject);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});


function reupdate(file, e){

}

function updateThumbnail(dropZoneElement, file) {
  //  console.log(dropZoneElement);
  console.log(file);
  //   console.log(file.type);
  //modelfile = file.data;
  //console.log(file);

  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  //remove current prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  //creating an element the first time
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;
  thumbnailElement.style.backgroundImage = "images/model_symbol.png";

  //image
  // if (file.type.startsWith("image/") {}

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = file => {
    var  modelF = file[0];
    console.log( file );
  }

 


  //reader.readAsDataURL(file);
 // reader.onload = () => {};
}
