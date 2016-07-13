const Util = require('./util');
const MovingShape = require('./moving_shape');
const Player = require('./player');

const Shape = function (pos, game, radius, velocity, color) {
  if (!velocity) {
    velocity = Util.randomVec(((Math.random() * 0.3) + 0.001));
  }

  radius = radius || (Math.random() * 10) + 10;

  color = color || Util.randomColor();

  MovingShape.call(this, pos, velocity, radius, color, game);
};

Util.inherits(Shape, MovingShape);

module.exports = Shape;
