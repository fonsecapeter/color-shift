const Game = require('./game');
const Player = require('./player');

function GameView(dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.playing = false;
}

GameView.MOVES = {
  'w':     [ 0,  -0.2],
  'up':    [ 0,  -0.2],
  'a':     [-0.2, 0],
  'left':  [-0.2, 0],
  's':     [ 0,   0.2],
  'down':  [ 0,   0.2],
  'd':     [ 0.2, 0],
  'right': [ 0.2, 0]
};

GameView.prototype.mapKeyHandlers = function () {
  const player = this.player;

  Object.keys(GameView.MOVES).forEach( k => {
    const move = GameView.MOVES[k];
    key(k, () => { player.thrust(move); }); // vendor/keymaster.js
  });
};

GameView.prototype.start = function (ctx) {
  this.game = new Game(this.dimX, this.dimY);
  this.player = this.game.player;
  this.playing = true;

  if (this.cycle) {
    clearInterval(this.cycle);
  }

  this.mapKeyHandlers();

  requestAnimationFrame(this.cycle.bind(this, ctx));
};

GameView.prototype.cycle = function (ctx) {
  this.game.step();
  this.game.render(ctx);
  this.isGameOver();

  if (this.game.isOver() === false ) {
    requestAnimationFrame(this.cycle.bind(this, ctx));
  }
};

GameView.prototype.isGameOver = function () {
  return false;
};

module.exports = GameView;
