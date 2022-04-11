//this should print the lists with only a button imput from the html.

//import{locationUpdater}from"./main";

 export function saveDynamicDataToFile() {
  //if mode is 1 then printString = sting1
  //if mode is 2 then printString = string2


 // locationUpdater();

  list.printListData();

  var mouseX = document.getElementById("mX").value;
  var mouseY = document.getElementById("mY").value;
  var mouseZ = document.getElementById("mZ").value;

  var latitude = document.getElementById("mLAT").value;
  var longitude = document.getElementById("mLNG").value;

  //var StringList = document.getElementById("List").value;

  // var myModule = require('js/main');

  //var String1 = myModule.StringList;
  // var String2 = myModule.StringList2;

  //boulder list
  var blob = new Blob(
    [
      "identifier PANGU: Boulder List File",
      "\n",
      "horizontal_scale 1",
      "\n",
      "offset 0 0",
      "\n",
      "// Each line following this comment is a crater definition consisting of four required and six optional values.",
      "\n",
      "// x_pos y_pos diameter age [irregularity mode] [irregularity ratio] [replace] [secondary] [infill height] [related boulders]",
      "\n",
      boulderString,
    ],
    { type: "text/plain;charset=utf-8", endings: "native" }
  );
  //crater list
  var blob2 = new Blob(
    [
      "identifier PANGU: Crater List File",
      "\n",
      "horizontal_scale 1",
      "\n",
      "offset 0 0",
      "\n",
      "size 513 513",
      "\n",
      "// Each line following this comment is a crater definition consisting of four required and six optional values.",
      "\n",
      "// x_pos y_pos diameter age [irregularity mode] [irregularity ratio] [replace] [secondary] [infill height] [related boulders]",
      "\n",
      craterString,
    ],
    { type: "text/plain;charset=utf-8", endings: "native" }
  );

  saveAs(blob, "boulder_list.txt");
  saveAs(blob2, "crater_list.txt");
}
