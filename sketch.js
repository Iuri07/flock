var grid_w;
var grid_h;
var scl = 25;
var nodes = [];
var flock = [];
var obstacles = [];
let initial_obstacles = 4;
let initial_flock = 300;
let flock_limit = 1000;
let player;
let debug = false;
let center_mouse = false;

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(createVector(0,0));
  grid_w = width / scl;
  grid_h = height / scl;
  for (x = 0; x < scl; x++) {
    for (y = 0; y < scl; y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }

  for (i = 0; i < initial_flock; i++) {
    flock.push(new Bird())
  }

  for (i = 0; i < initial_obstacles; i++) {
    obstacles.push(new Obstacle(createVector(random(25,width-25),random(25,height-25)), 50));
    obstacles[i].set_nodes();
  }
}

function mouseReleased() {
  if(mouseButton == RIGHT){
    for (i = 0; i < 40; i++) {
      if (flock.length > flock_limit)
      flock.shift();
      flock.push(new Bird(createVector(mouseX, mouseY)))
    }
  }
}

function keyPressed(){
  if(key === 'd'){
    debug = !debug;
  } else if(key === ' '){
    let d = false;
    let i = obstacles.length;
    while(i--){
      if(obstacles[i].contains(createVector(mouseX,mouseY))){
        d = true;
        obstacles[i].remove();
        obstacles.splice(i,1);
      }
    }
    if(!d){
      obstacle = new Obstacle(createVector(mouseX, mouseY), 50);
      obstacle.set_nodes();
      obstacles.push(obstacle);
    }
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
    if(mouseIsPressed && mouseButton === LEFT){
      player.update();
      bird.follow(player.pos, 0.4);
      bird.avoid(1)
    }
  }

  for(let obstacle of obstacles){
    obstacle.show();
  }

}

window.onresize = function() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  grid_w = window.innerWidth / scl;
  grid_h = window.innerHeight / scl;
  nodes = [];
  for (x = 0; x < scl; x++) {
    for (y = 0; y < scl; y++) {
      nodes.push(new Node(x * grid_w, y * grid_h, grid_w, grid_h));
    }
  }

  for(let obstacle of obstacles){
    obstacle.remove();
    obstacle.update();
    obstacle.set_nodes();
  }

}
