const Player = require('./player');
const Shape = require('./shape');
const Util = require('./util');

const NUM_SHAPES = 40;

function Game (dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.shapes = [];

  for (let i = 0; i < NUM_SHAPES; i++) {
    this.addShape();
  }

  const playerPos = [(dimX / 2), (dimY / 2)];
  this.player = new Player(playerPos, this);

  this.allShapes = this.shapes.concat([this.player]);
}

Game.prototype.step = function () {
  this.isOver();
  this.moveShapes();
  this.checkCollisions();
};

Game.prototype.render = function (ctx) {
  ctx.clearRect(0, 0, this.dimX, this.dimY);

  this.allShapes.forEach( shape => {
    shape.render(ctx);
  });
};

Game.prototype.checkCollisions = function () {
  //
};

Game.prototype.moveShapes = function () {
  this.allShapes.forEach( shape => {
    shape.move();
  });
};

Game.prototype.addShape = function (pos, velocity, radius) {
  if (!pos) {
    pos = Util.randomPos(this.dimX, this.dimY);
    this.shapes.push(new Shape(pos, this));
  } else {
    this.shape.push(new Shape(pos, this, radius, velocity));
  }
};

Game.removeShape = function (shape) {
  const idx = this.allShapes.indexOf(shape);
  if (idx > -1) {
    this.allShapes.splice(idx, 1);
  }
};

Game.prototype.isOver = function () {
  if (this.allShapes.indexOf(this.player) === -1) {
    return true;
  } else {
    return false;
  }
};

module.exports = Game;
