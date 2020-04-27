class Obstacle {
  constructor( pos, diameter ) {
    this.pos = pos;
    this.diameter = diameter;
    this.grid_pos = createVector( floor( this.pos.x / width * scl ), floor( this.pos.y * scl / height ) );
    this.nodes = [];
  }

  remove(){
    for(let node of nodes){
      node.obstacles = node.obstacles.filter(item => item !== this);
      this.nodes = this.nodes.filter(item => item !== node);
    }
  }

  contains(point) {
    return (
      abs(point.x - this.pos.x) <= this.diameter/2 &&
      abs(point.y - this.pos.y) <= this.diameter/2
    );
  }

  intersects(point) {
    return ( abs( point.pos.x - this.pos.x ) <= this.diameter / 2 + point.diameter/2 );
  }

  update(){
    this.grid_pos = createVector( floor( this.pos.x / width * scl ), floor( this.pos.y * scl / height ) );
  }

  set_nodes() {
    this.nodes = []
    let maxX = ceil( this.diameter / ( grid_w ) ) + 1;
    let maxY = ceil( this.diameter / ( grid_h ) ) + 1;

    for ( x = 0; x <= maxX; x++ ) {
      for ( y = 0; y <= maxY; y++ ) {
        let _x = mod(ceil( this.grid_pos.x + x - maxX / 2 ),scl);
        let _y = mod(ceil( this.grid_pos.y + y - maxY / 2 ),scl);
        let node = nodes[ get_uni_pos( _x, _y ) ] ;

        if ( node.intersects( new Range( this.pos, this.diameter ) ) ) {
          this.nodes.push( node );
          node.obstacles.push(this);
        }
      }
    }
  }

  show() {
    stroke( 255 );
    strokeWeight( 2 );
    fill( 255,0 );
    ellipse( this.pos.x, this.pos.y, this.diameter );
    if(debug){
      for(let node of this.nodes){
        node.glow(color(0,0,255))
      }
    }
  }
}
