function get_uni_pos(x, y) {
  return x * (scl)  + y;
}

class Range {
  constructor(pos, r) {
    this.pos = pos;
    this.radius = r / 2;
  }

  intersects(circle){
    return(
      dist(this.pos, circle.pos) - circle.radius <= this.radius
    );
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
    this.crowd = 2;

    this.node = null;
    this.local_flock = [];
    this.local_obstacles = [];
    this.range = new Range(this.pos, this.diameter);
    this.grid_pos = createVector(floor(this.pos.x / width* scl) , floor(this.pos.y * scl/ height) * scl)
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
    this.local_obstacles = []

    for (x = 0; x < maxX; x++) {
      for (y = 0; y <= maxY; y++) {
        let _x = ceil(this.grid_pos.x + x - maxX / 2);
        let _y = ceil(this.grid_pos.y + y - maxY / 2);
        let node  = nodes[get_uni_pos(_x, _y)];

        if (_x < scl && _x >= 0 && _y < scl && _y >= 0 && node) {
          if (node.intersects(this.range)) {
            node.query(this.range, this.local_flock);
            for(let obstacle of node.obstacles){
              if(obstacle.intersects(this) && !this.local_obstacles.includes(obstacle))
                this.local_obstacles.push(obstacle);
            }
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

  follow(goal_pos, factor){
    let diff = p5.Vector.sub(goal_pos, this.pos);

    diff.setMag(this.maxSpeed);
    diff.sub(this.velocity);
    diff.limit(this.maxForce);
    this.acceleration.add(diff.mult(factor));
  }

  avoid(factor){
    let acc = createVector(0,0);
    if(this.local_obstacles.length > 0){
      for(let obstacle of this.local_obstacles){
        let obs_pos = obstacle.pos.copy();
        let r = p5.Vector.sub(this.pos, obstacle.pos).setMag(obstacle.diameter/2 + 10);
        obs_pos.add(r);
        let diff = p5.Vector.sub(this.pos, obs_pos);
        let d = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);
        let angle = acos((obstacle.diameter/2)/(obstacle.diameter/2 + d));
        pop();
        angleMode(degrees);
        let angle_dir = diff.angleBetween(this.velocity);
        r.rotate(angle*(angle_dir/abs(angle_dir)));
        push();

        diff.div(pow(d, 2));
        diff.add(r);
        acc.add(diff);
        acc.setMag(this.maxSpeed);
        acc.sub(this.velocity);
        acc.limit(this.maxForce);
        this.acceleration.add(acc.mult(factor));
      }
    }
  }


  flock(){
    let a_factor = 1;
    let c_factor = 1;
    let s_factor = 1.2;
    let avoid_factor = 2;
    if(this.local_flock.length > 1){
      this.align(a_factor);
      this.cohesion(c_factor);
      this.separate(s_factor);
    }
    this.avoid(avoid_factor);

  }

  check_border() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
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
