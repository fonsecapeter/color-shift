const GameView = require('./game_view');

const startEl = document.getElementById('new');
const canvasEl = document.getElementById("main");
const clockEl = document.getElementById("clock");

canvasEl.width = viewportSize.getWidth() - 5;
canvasEl.height = viewportSize.getHeight() - 4;

const ctx = canvasEl.getContext('2d');

window.playing = false;
document.addEventListener("keydown", () => {
  if (!window.playing) {
    startEl.className += " hidden";

    window.playing = true;
    const gameView = new GameView(canvasEl.width, canvasEl.height, clockEl).start(ctx);
  }
});
