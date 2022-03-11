//var StringTest ;
var boulderString;
var craterString;

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

    printListData() {
      let current = this.head;
      
      while(current) {
  
        if(current.type == 1) {
  
        boulderString = boulderString +"\n"+ current.Nlng + "       " + current.Nlat +"       " + current.size +"       " + current.depth + "       " + current.index;
          
          }   else  if(current.type == 2) {
  
            craterString = craterString +"\n"+ current.Nlng + "       " + current.Nlat +"       " + current.size +"       " + current.depth + "       " + current.index;
              
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
  console.log(boulderString);
  
  
  }
 