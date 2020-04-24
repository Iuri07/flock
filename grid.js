

class Node {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.points = [];
    this.c = color(255);
  }

  glow(){
    this.c = color(0,255,0);
  }

  intersects(circle){
    if(circle.x + circle.r > this.x &&
      circle.y + circle.r > this.y &&
      circle.x - circle.r < this.x + this.w &&
      circle.y - circle.r < this.y + this.h)
        return true;
    return false;
  }

  query(range, found) {
    if (!this.intersects(range)){
      return;
    } else {
      for (let p of this.points){
        if (range.contains(p))
          found.push(p);
      }
    }
    return;
  }

  show(){
    stroke(this.c);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.w, this.h);

    for (let p of this.points) {
      strokeWeight(2);
      point(p.x, p.y);
    }
    this.c = color(255)
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
