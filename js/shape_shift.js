const GameView = require('./game_view');

const canvasEl = document.getElementById("main");

canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;

const ctx = canvasEl.getContext('2d');
const gameView = new GameView(canvasEl.width, canvasEl.height);
