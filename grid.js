class Node {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.birds = [];
    this.obstacles = [];
    this.c = color(255);
  }

  glow(c) {
    this.c = c || color(0, 255, 0);
  }

  intersects(circle) {
    if (circle.pos.x + circle.radius > this.x &&
      circle.pos.y + circle.radius > this.y &&
      circle.pos.x - circle.radius < this.x + this.w &&
      circle.pos.y - circle.radius < this.y + this.h)
      return true;
    return false;
  }

  query(range, found) {
    if (!this.intersects(range)) {
      return;
    } else {
      for (let p of this.birds) {
        if (range.contains(p))
          found.push(p);
      }
    }
    return;
  }

  show() {
    stroke(this.c);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.w, this.h);
    this.c = color(255)
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
