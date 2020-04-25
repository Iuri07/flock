function get_uni_pos(x, y) {
  return x * (scl ) + y;
}

class Range {
  constructor(pos, r) {
    this.pos = pos;
    this.radius = r / 2;
  }

  contains(point) {
    return (
      abs(point.pos.x - this.pos.x) <= this.radius &&
      abs(point.pos.y - this.pos.y) <= this.radius
    );
  }

}

class Bird {
  constructor(pos) {
    this.c = color(255)
    this.pos = pos || createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector(0,0);
    this.diameter = 100;
    this.maxSpeed = 4;
    this.maxForce = .2;
    this.crowd = 3;

    this.node = null;
    this.local_flock = [];
    this.range = new Range(this.pos, this.diameter);
    this.grid_pos = createVector(floor(this.pos.x / width * scl), floor(this.pos.y * scl / height))
  }

  set_node() {
    if (!this.node) {
      this.node = nodes[get_uni_pos(this.grid_pos.x, this.grid_pos.y)];
      if (this.node != undefined) {
        this.node.birds.push(this);
      }
    } else if (this.node != nodes[get_uni_pos(this.grid_pos.x, this.grid_pos.y)]) {
      this.node.birds = this.node.birds.filter(item => item !== this)
      this.node = nodes[get_uni_pos(this.grid_pos.x, this.grid_pos.y)];
      if (this.node != undefined)
        this.node.birds.push(this);
    }
  }

  search_neighbors() {
    let maxX = ceil(this.diameter / (grid_w)) + 1;
    let maxY = ceil(this.diameter / (grid_h)) + 1;
    this.local_flock = []

    for (x = 0; x < maxX; x++) {
      for (y = 0; y <= maxY; y++) {
        let _x = ceil(this.grid_pos.x + x - maxX / 2);
        let _y = ceil(this.grid_pos.y + y - maxY / 2);

        if (_x < scl && _x >= 0 && _y < scl && _y >= 0) {
          if (nodes[get_uni_pos(_x, _y)].intersects(this.range)) {
            nodes[get_uni_pos(_x, _y)].query(this.range, this.local_flock);
          }
        }
      }
    }
  }

  align(factor) {
    let avg_velocity = createVector(0,0);
    let acc = createVector(0,0);

    avg_velocity.add(this.velocity)
    for(let bird of this.local_flock){
      avg_velocity.add(bird.velocity);
    }
    avg_velocity.div(this.local_flock.length);
    acc.add(avg_velocity);
    acc.setMag(this.maxSpeed);
    acc.sub(this.velocity);
    acc.limit(this.maxForce);
    this.acceleration.add(acc.mult(factor));
  }

  cohesion(factor) {
    let avg_pos = createVector(0,0);
    let acc = createVector(0,0);

    for(let bird of this.local_flock){
      if(bird != this)
        avg_pos.add(bird.pos);
    }
    avg_pos.div(this.local_flock.length-1);
    acc.add(avg_pos);
    acc.sub(this.pos);
    acc.setMag(this.maxSpeed);
    acc.sub(this.velocity);
    acc.limit(this.maxForce);
    this.acceleration.add(acc.mult(factor));
  }

  separate(factor) {
    if(this.local_flock.length > this.crowd){
      let acc = createVector(0,0);
      for(let bird of this.local_flock){
        if(bird != this){
          let diff = p5.Vector.sub(this.pos, bird.pos);
          diff.div(pow(dist(this.pos.x, this.pos.y, bird.pos.x, bird.pos.y), 2));
          acc.add(diff);
        }
      }
      acc.div(this.local_flock.length-1);
      acc.setMag(this.maxSpeed);
      acc.sub(this.velocity);
      acc.limit(this.maxForce);
      this.acceleration.add(acc.mult(factor));
    }
  }


  check_border() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  flock(){
    let a_factor = 1;
    let c_factor = 1;
    let s_factor = 1.2;
    if(this.local_flock.length > 1){
      this.align(a_factor);
      this.cohesion(c_factor);
      this.separate(s_factor);
    }

  }

  update() {
    this.pos.add(this.velocity);
    this.check_border();
    this.velocity.add(this.acceleration).limit(this.maxSpeed);

    this.range.pos = this.pos;
    this.grid_pos = createVector(floor(this.pos.x / width * scl), floor(this.pos.y * scl / height));

    this.set_node();
    this.search_neighbors();
    this.acceleration.mult(0);
  }

  show() {
    let dir = this.velocity.copy();
    dir.setMag(10);
    let b = dir.copy().add(this.pos);
    dir.rotate(5*PI/6);
    let a = dir.copy().add(this.pos);
    dir.rotate(PI/3);
    let c = dir.copy().add(this.pos);
    if(this.node)
      this.node.glow()
    noFill();
    stroke(this.c);
    strokeWeight(2);
    triangle(a.x,a.y,b.x,b.y,c.x,c.y);
  }

}
