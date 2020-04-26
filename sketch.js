var grid_w;
var grid_h;
var scl = 25;
var nodes = [];
var flock = [];
let initial_flock = 300;
let flock_limit = 1000;
let player;
let debug = false;

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

  for (i = 0; i < initial_flock; i++) {
    flock.push(new Bird())
  }
}

function mouseClicked() {
  for (i = 0; i < 40; i++) {
    if (flock.length > flock_limit)
      flock.shift();
    flock.push(new Bird(createVector(mouseX, mouseY)))
  }

}

function keyPressed(){
  if(key === 'd'){
    debug = !debug;
  }
}

function draw() {
  background(30);

  if(debug){
    for(let n of nodes){
      n.show();
    }
  }

  for (let bird of flock) {
    bird.show();
    bird.update();
    bird.flock();
    if(mouseIsPressed){
      if(mouseButton === RIGHT) {
        player.update();
        bird.follow(player.pos, 0.4)
      }
    }
  }

}

window.onresize = function() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  grid_w = window.innerWidth / scl;
  grid_h = window.innerHeight / scl;
  console.log(width, height)
  nodes = [];
  for (x = 0; x < ceil(width / grid_w); x++) {
    for (y = 0; y < ceil(height / grid_h); y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }

}
