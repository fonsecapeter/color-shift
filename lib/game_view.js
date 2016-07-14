const Game = require('./game');
const Player = require('./player');

function GameView(dimX, dimY, clockEl, endEl, endTimeEl) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.clockEl = clockEl;
  this.endEl = endEl;
  this.endTimeEl = endTimeEl;
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
  this.time = 0;
  this.startTime = Date.now();
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
  this.time = Math.floor((Date.now() - this.startTime) / 1000);
  if (this.time > 0) {
    this.clockEl.innerHTML = `${this.time}`;
  }

  this.game.step();
  this.game.render(ctx);

  if (this.game.isOver() === false ) {
    requestAnimationFrame(this.cycle.bind(this, ctx));
  } else {
    this.endingSequence();
  }
};

GameView.prototype.endingSequence = function () {
  this.endTimeEl.innerHTML = `Completed in ${this.time} seconds`;
  this.endEl.className = "toplevel-wrapper";
  this.clockEl.className = "hidden";
  window.playing = false;
};

module.exports = GameView;
