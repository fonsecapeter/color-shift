const MovingShape = require('./moving_shape');
const Util = require('./util');

const RADIUS = 20;
const VELOCITY = [0, 0];
const COLOR = "#1E824C";

const Player = function (pos, game) {
  MovingShape.call(this, pos, VELOCITY, RADIUS, COLOR, game);
};

Util.inherits(Player, MovingShape);

Player.prototype.thrust = function (impulse) {
  this.velocity[0] += impulse[0];
  this.velocity[1] += impulse[1];
};

module.exports = Player;
