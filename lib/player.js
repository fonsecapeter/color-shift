const MovingShape = require('./moving_shape');
const Util = require('./util');

const RADIUS = 20;
const VELOCITY = [0, 0];

const COLORS = {
  bright: "#0cc9c7",
  medium: "#369393",
  dim: "#2e4852"
};

const Player = function (pos, game) {
  this.color = COLORS.bright;
  MovingShape.call(this, pos, VELOCITY, RADIUS, this.color, game);
};

Util.inherits(Player, MovingShape);

Player.prototype.thrust = function (impulse) {
  this.velocity[0] += impulse[0];
  this.velocity[1] += impulse[1];
};

module.exports = Player;
