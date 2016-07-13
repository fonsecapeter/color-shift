const Player = require('./player');

function Game (dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;

  const playerPos = [(dimX / 2), (dimY / 2)];
  this.player = new Player(playerPos, this);
}

Game.prototype.render = function (ctx) {
  ctx.clearRext(0, 0, this.dimX, this.dimY);
  
};

Game.prototype.step = function () {

};

module.exports = Game;
