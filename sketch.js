var grid_w;
var grid_h;
var scl = 25;
var nodes = [];
var flock = [];
let starting_birds = 300;
let bird_limit = 1000;
let player;

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(createVector(0,0))
  grid_w = width / scl;
  grid_h = height / scl;
  for (x = 0; x < width / grid_w; x++) {
    for (y = 0; y < height / grid_h; y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }

  for (i = 0; i < starting_birds; i++) {
    flock.push(new Bird())
  }
}

function mouseClicked() {
  for (i = 0; i < 40; i++) {
    if (flock.length > bird_limit)
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
    if(mouseIsPressed){
      if(mouseButton === RIGHT) {
        player.update();
        bird.follow(createVector(mouseX, mouseY), 0.4)
      }
    }
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
