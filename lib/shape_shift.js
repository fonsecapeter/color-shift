const GameView = require('./game_view');

const startEl = document.getElementById('new');
const endEl = document.getElementById('end');
const canvasEl = document.getElementById("main");
const clockEl = document.getElementById("clock");
const endTimeEl = document.getElementById("end-time");

canvasEl.width = viewportSize.getWidth() - 5;
canvasEl.height = viewportSize.getHeight() - 4;

const ctx = canvasEl.getContext('2d');

window.playing = false;
document.addEventListener("keydown", () => {
  if (!window.playing && event.keyCode === 32) {
    clockEl.className = "clock";
    clockEl.innerHTML = "";
    endEl.className = "toplevel-wrapper hidden";
    startEl.className += " hidden";

    window.playing = true;
    const gameView = new GameView(canvasEl.width, canvasEl.height, clockEl, endEl, endTimeEl).start(ctx);
  }
});
