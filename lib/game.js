const Player = require('./player');
const Shape = require('./shape');
const Util = require('./util');
const Constants = require('./constants');

const NUM_SHAPES = 30;

function Game (dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.shapes = {
    bright: [],
    medium: [],
    dim: []
  };

  for (let i = 0; i < NUM_SHAPES; i++) {
    this.addShape();
  }

  const playerPos = [(dimX / 2), (dimY / 2)];
  this.player = new Player(playerPos, this, this.invalidColors());
  this.shapes.player = [this.player];
}

Game.prototype.step = function () {
  this.isOver();
  this.moveShapes();
  this.checkCollisions();
};

Game.prototype.render = function (ctx) {
  ctx.clearRect(0, 0, this.dimX, this.dimY);

  this.forEachShape ( shape => {
    shape.render(ctx);
  });

  this.player.render(ctx);
};

Game.prototype.checkCollisions = function () {
  this.forEachShape ( shape => {
    if (shape.isCollidedWith(this.player)) {
      shape.collidedWithPlayer();
    }

    this.forEachShape ( otherShape => {
      if (otherShape !== this) {
        shape.isCollidedWith(otherShape);
      }
    });
  });
};

Game.prototype.moveShapes = function () {
  this.forEachShape(shape => {
    shape.move();
  });

  this.player.move();
};

Game.prototype.addShape = function (pos, velocity, radius) {
  let shape;
  if (!pos) {
    pos = Util.randomPos(this.dimX, this.dimY);
    shape = new Shape(pos, this);
  } else {
    shape = new Shape(pos, this, radius, velocity);
  }

  const clrCode = Object.keys(Constants.COLORS).filter( key => Constants.COLORS[key] === shape.color)[0];

  this.shapes[clrCode].push(shape);
};

Game.prototype.removeShape = function (shape) {
  const clrCode = Object.keys(Constants.COLORS).filter( key => Constants.COLORS[key] === shape.color)[0];

  const idx = this.shapes[clrCode].indexOf(shape);
  if (idx > -1) {
    this.shapes[clrCode].splice(idx, 1);
  }
};

Game.prototype.isOver = function () {
  // Object.keys(this.shapes).forEach ( color => {
  for (let i = 0; i < Object.keys(this.shapes).length; i ++) {
    const color = Object.keys(this.shapes)[i];
    if (this.shapes[color].length > 0 && color !== "player") {
      return false;
    }
  }
  return true;
};

Game.prototype.invalidColors = function () {
  let colors = {};
  Object.keys(Constants.COLORS).forEach( color => {
    colors[Constants.COLORS[color]] = 0;
  });

  this.forEachShape ( shape => {
    if (!shape.isPlayer) {
      colors[shape.color] += 1;
    }
  });

  let emptyColors = [];
  Object.keys(colors).forEach( color => {
    if (colors[color] < 1) {
      emptyColors.push(color);
    }
  });

  if (emptyColors.length < Object.keys(Constants.COLORS).length - 1 && this.player) {
    emptyColors.push(this.player.color);
  }

  return emptyColors;
};

Game.prototype.forEachShape = function (callback) {
  Object.keys(this.shapes).forEach( color => {
    this.shapes[color].forEach ( shape => {
      callback(shape);
    });
  });
};

module.exports = Game;
