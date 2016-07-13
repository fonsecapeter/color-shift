const GameView = require('./game_view');

const canvasEl = document.getElementById("main");

// canvasEl.width = window.innerWidth;
// canvasEl.height = window.innerHeight;

canvasEl.width = viewportSize.getWidth() - 5;
canvasEl.height = viewportSize.getHeight() - 4;

const ctx = canvasEl.getContext('2d');
const gameView = new GameView(canvasEl.width, canvasEl.height).start(ctx);
