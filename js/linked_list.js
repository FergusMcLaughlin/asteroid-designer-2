var StringTest ;

class linkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
  
    //Insert first.
    insertFirst(type, Nlat, Nlng, size, depth, index) {
        this.head = new node(type, Nlat, Nlng, size, depth, index,this.head);
  
        this.size++;
    }
  
    //Insert last.
    insertLast(type, Nlat, Nlng, size, depth, index) {
        let n0de = new node(type, Nlat, Nlng, size, depth, index);
        let current;
  
        //if empty, = head
        if(!this.head) {
            this.head = n0de;
        } else {
            current = this.head;
  
            while(current.next) {
                current = current.next;
            }
            current.next = n0de;
        }
  
        this.size++;
    }
  
    //Insert at index.
    inserAt(type, Nlat, Nlng, size, depth, index) {
        //if out of range
        if(index > 0 && index > this.size){
            return;
        }
  
        //if first
        if(index === 0) {
            this.head = new node(type, Nlat, Nlng, size, depth, index, this.head);
  
            this.size++;
        }
  
        const n0de = new node(type, Nlat, Nlng, size, depth, index);
        let current, previous;
  
        //set current to first
        current = this.head;
        let count = 0;
  
        while(count < index) {
            previous = current; // node before index
            count++;
            current = current.next; // node after
        }
  
        n0de.next = current;
        previous.next = n0de;
  
        this.size++;
  
    }
  
    //Get at index.
    getAt(index) {
        let current = this.head;
        let count = 0;
  
        while(current) {
            if(count == index) {
                console.log(current.ID);
  
                console.log(current.Nlat);
                console.log(current.Nlng);
  
                console.log(current.size);
                console.log(current.depth);
                console.log(current.index);
        
            }
            count++;
            current = current.next;
        }
  
        return null;
    }
  
    //Remove at index.
    removeAt(index) {
        if(index > 0 && index > this.size) {
            return;
        }
  
        let current = this.head;
        let previous;
        let count = 0;
  
        //remove first
        if(index === 0) {
            this.head = current.next;
        } else {
            while(count < index) {
                count ++;
                previous = current;
                current = current.next;
                
            }
  
            previous.next = current.next;
        }
  
        this.size--;
    }
  
    //Clear list.
    clearList() {
        this.head = null;
        this.size = 0;
        //stuff is still in mem but this works for now
    }
  /*
    //Print ID.
    printListData() {
    let current = this.head;
  
    while(current) {
        console.log(current.ID);
        console.log(current.Nlat);
        console.log(current.Nlng);
  
       // console.log(current.size);
       // console.log(current.depth);
       // console.log(current.index);
  
  
        current = current.next;
        }
    }
  */
    printListData() {
      let current = this.head;
      
      while(current) {
  
        if(current.type == 1) {
  
        StringTest = StringTest +"\n"+ current.Nlng + "       " + current.Nlat +"       " + current.size +"       " + current.depth + "       " + current.index;
          
          }   else  if(current.type == 2) {
  
            StringTest2 = StringTest2 +"\n"+ current.Nlng + "       " + current.Nlat +"       " + current.size +"       " + current.depth + "       " + current.index;
              
            }
          current = current.next;
        }
          
      }
  
    toSting() {
      return;
    }
  }
  
  
  
  const list = new linkedList();
  window.listTest = function(){
  
  
  //list.insertLast(400,200);
  
  list.printListData();
  
  
  }
  //list.getAt(2);
  /*
  var blob = new Blob(
    [
      "identifier :",
      " ",
      "*This will be based of the mode*",
      "\n",
      "horizontal_scale",
      " ",
      "*place holder*",
      "\n",
      "offset",
      " ",
      "*place holder*",
      "\n",
      "size",
      " ",
      "*place holder*",
      "\n",
      "// Each line following this comment is a crater definition consisting of four required and six optional values.",
      "\n",
      "// x_pos y_pos diameter age [irregularity mode] [irregularity ratio] [replace] [secondary] [infill height] [related boulders]",
      "\n",
      latitude,
      "     ",
      longitude,
    ],
    { type: "text/plain;charset=utf-8" }
  );
  saveAs(blob, "Coordinates.txt");
  }
  
  
  
  document.getElementById("Coord_List").value = Glat;
  */