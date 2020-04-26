class Player {
  constructor(pos) {
    this.pos = pos;
  }

  update() {
    this.pos = createVector(mouseX, mouseY);
    let grid_pos = createVector(floor(this.pos.x / width * scl), floor(this.pos.y * scl / height))
    let node = nodes[get_uni_pos(grid_pos.x, grid_pos.y)];
    if(!node) return;
    
    for(let bird of node.birds){
      if(dist(this.pos.x, this.pos.y, bird.pos.x, bird.pos.y) < 5){
        bird.c = color(255,0,0);
      }
    }
  }
}
