/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	
	const canvasEl = document.getElementById("main");
	
	canvasEl.height = window.innerHeight;
	canvasEl.width = window.innerWidth;
	
	const ctx = canvasEl.getContext('2d');
	const gameView = new GameView(canvasEl.width, canvasEl.height).start(ctx);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	
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
	    // key(k, () => { player.thrust(move); });
	    key(k, () => { console.log(move); });
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
	
	  requestAnimationFrame(this.cycle());
	};
	
	GameView.prototype.cycle = function () {
	  this.game.step();
	  this.game.render();
	  this.isGameOver();
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.isGameOver = function () {
	  return false;
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Game (dimX, dimY) {
	  this.dimX = dimX;
	  this.dimY = dimY;
	}
	
	Game.prototype.step = function () {
	
	};
	
	Game.prototype.render = function () {
	
	};
	
	module.exports = Game;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map