var grid_w;
var grid_h;
var scl = 50;
var nodes = [];
var flock = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid_w = width / scl;
  grid_h = height / scl;
  for (x = 0; x < width / grid_w; x++) {
    for (y = 0; y < height / grid_h; y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }

  for (i = 0; i < 3000; i++) {
    flock.push(new Bird())
  }
}

function mouseClicked() {
  for (i = 0; i < 40; i++) {
    if (flock.length > 1000)
      flock.shift();
    flock.push(new Bird(createVector(mouseX, mouseY)))
  }
}

function draw() {
  background(30);
  // for(let n of nodes){
  //   n.show();
  // }
  for (let bird of flock) {
    bird.show();
    bird.update();
    bird.flock();
  }

}

function windowResized() {
  nodes = [];
  resizeCanvas(windowWidth, windowHeight);
  grid_w = width / scl;
  grid_h = height / scl;
  for (x = 0; x < width / grid_w; x++) {
    for (y = 0; y < height / grid_h; y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }
}
