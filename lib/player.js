const MovingShape = require('./moving_shape');
const Util = require('./util');
const Constants = require('./constants.js');

const RADIUS = 16;
const VELOCITY = [0, 0];

const Player = function (pos, game) {
  this.isPlayer = true;
  this.color = Constants.COLORS.bright;
  MovingShape.call(this, pos, VELOCITY, RADIUS, this.color, game);
};

Util.inherits(Player, MovingShape);

Player.prototype.thrust = function (impulse) {
  this.velocity[0] += impulse[0];
  this.velocity[1] += impulse[1];
};

module.exports = Player;
