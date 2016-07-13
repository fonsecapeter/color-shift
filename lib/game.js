const Player = require('./player');

function Game (dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;

  const playerPos = [(dimX / 2), (dimY / 2)];
  this.player = new Player(playerPos, this);

  this.allShapes = [this.player];
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
  // fill this later
};

Game.prototype.moveShapes = function () {
  this.allShapes.forEach( shape => {
    shape.move();
  });
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

Game.prototype.randomPos = function () {
  return [
    this.dimX * Math.random(),
    this.dimY * Math.random(),
  ];
};

module.exports = Game;
