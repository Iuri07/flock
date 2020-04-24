var grid_w;
var grid_h;
var scl = 25;
var nodes = [];
var points = [];
var speed = 4;

function setup() {
  createCanvas(windowWidth,windowHeight);
  grid_w = width/scl;
  grid_h = height/scl;
  for(x = 0; x < width/grid_w; x++){
    for(y = 0; y < height/grid_h; y++){
      nodes.push(new Node(x*grid_w, y*grid_h, grid_w, grid_h));
    }
  }

  for(i = 0; i < 100; i++){
    points.push(new Bird(width/2, height/2, 100, createVector(random(-1, 1), random(-1, 1)), speed))
  }
}

function draw() {
  background(30);

  for(let n of nodes){
    n.show();
  }

  for(let bird of points){
    bird.show();
    bird.update();
  }

}
