function get_uni_pos(x,y){
    return x*(scl) + y;
}

class Range {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r/2;
  }

  contains(point){
    return (
      abs(point.x - this.r) <= this.r &&
      abs(point.y - this.r) <= this.r
    );
  }

}

class Bird {
  constructor(x, y, d, dir, speed) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.dir = dir;
    this.speed = speed;
    this.range = new Range(this.x, this.y, this.d);
    this.grid_pos_x = floor(this.x/width*scl);
    this.grid_pos_y = floor(this.y*scl/height);
  }

  search_neighbors(){
    let maxX = ceil(this.d/(grid_w)) + 1;
    let maxY = ceil(this.d/(grid_h)) + 1;

    for(x=0; x < maxX; x ++){
      for(y=0; y <= maxY; y ++){
        let _x = ceil(this.grid_pos_x + x - maxX/2);
        let _y = ceil(this.grid_pos_y + y - maxY/2);

        if(_x < scl && _x >= 0 && _y < scl && _y >= 0){
          if( nodes[get_uni_pos(_x, _y)].intersects(this.range))
            nodes[get_uni_pos(_x, _y)].glow();
        }
      }
    }
  }

  check_border(){
    if(this.x > width) this.x = 0;
    if(this.x < 0) this.x = width;
    if(this.y > height) this.y = 0;
    if(this.y < 0) this.y = height;
  }

  update(){
    this.x += this.dir.setMag(this.speed).x;
    this.y += this.dir.setMag(this.speed).y;
    this.check_border();
    this.range.x = this.x;
    this.range.y = this.y;
    this.grid_pos_x = floor(this.x/width*scl);
    this.grid_pos_y = floor(this.y*scl/height);


    this.search_neighbors();
  }

  show(){
    stroke(255);
    strokeWeight(4);
    point(this.x, this.y);
    strokeWeight(1);
    ellipse(this.x, this.y, this.d)
  }

}
