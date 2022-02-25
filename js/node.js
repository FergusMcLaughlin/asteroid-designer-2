class node {
    constructor(type, Nlat, Nlng, size, depth, index, next = null) {
  
        this.type = type;
  
        this.Nlat = Nlat;
        this.Nlng = Nlng;
  
        this.size = size;
        this.depth = depth;
        this.index = index;
  
  
        this.next = next;
    }
  }