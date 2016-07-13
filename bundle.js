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
	
	// canvasEl.width = window.innerWidth;
	// canvasEl.height = window.innerHeight;
	
	canvasEl.width = viewportSize.getWidth() - 5;
	canvasEl.height = viewportSize.getHeight() - 4;
	
	const ctx = canvasEl.getContext('2d');
	const gameView = new GameView(canvasEl.width, canvasEl.height).start(ctx);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const Player = __webpack_require__(3);
	
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
	
	  requestAnimationFrame(this.cycle.bind(this, ctx));
	};
	
	GameView.prototype.isGameOver = function () {
	  return false;
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(3);
	
	function Game (dimX, dimY) {
	  this.dimX = dimX;
	  this.dimY = dimY;
	
	  const playerPos = [(dimX / 2), (dimY / 2)];
	  this.player = new Player(playerPos, this);
	
	  this.allShapes = [this.player];
	}
	
	Game.prototype.step = function () {
	  this.isOver();
	  this.moveShapes();
	  this.checkCollisions();
	};
	
	Game.prototype.render = function (ctx) {
	  ctx.clearRect(0, 0, this.dimX, this.dimY);
	
	  this.allShapes.forEach( shape => {
	    shape.render(ctx);
	  });
	};
	
	Game.prototype.checkCollisions = function () {
	  // fill this later
	};
	
	Game.prototype.moveShapes = function () {
	  this.allShapes.forEach( shape => {
	    shape.move();
	  });
	};
	
	Game.removeShape = function (shape) {
	  const idx = this.allShapes.indexOf(shape);
	  if (idx > -1) {
	    this.allShapes.splice(idx, 1);
	  }
	};
	
	Game.prototype.isOver = function () {
	  if (this.allShapes.indexOf(this.player) === -1) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	Game.prototype.randomPos = function () {
	  return [
	    this.dimX * Math.random(),
	    this.dimY * Math.random(),
	  ];
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingShape = __webpack_require__(4);
	const Util = __webpack_require__(5);
	
	const RADIUS = 20;
	const VELOCITY = [0, 0];
	
	const COLORS = {
	  bright: "#0cc9c7",
	  medium: "#369393",
	  dim: "#2e4852"
	};
	
	const Player = function (pos, game) {
	  this.color = COLORS.bright;
	  MovingShape.call(this, pos, VELOCITY, RADIUS, this.color, game);
	};
	
	Util.inherits(Player, MovingShape);
	
	Player.prototype.thrust = function (impulse) {
	  this.velocity[0] += impulse[0];
	  this.velocity[1] += impulse[1];
	};
	
	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MovingShape (pos, velocity, radius, color, game) {
	  this.pos = pos;
	  this.velocity = velocity;
	  this.radius = radius;
	  this.color = color;
	  this.game = game;
	}
	
	MovingShape.prototype.render = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
	};
	
	MovingShape.prototype.move = function () {
	  this.ensureBounce(this.pos);
	  this.windResit(this.velocity);
	
	  this.pos[0] = this.pos[0] + (this.velocity[0]);
	  this.pos[1] = this.pos[1] + (this.velocity[1]);
	};
	
	MovingShape.prototype.windResit = function () {
	  const signage = [
	    (this.velocity[0] < 0) ? -1 : 1,
	    (this.velocity[1] < 0) ? -1 : 1
	  ];
	
	  const drag = [
	    Math.pow(this.velocity[0], 2) * this.radius * 0.0002 * signage[0],
	    Math.pow(this.velocity[1], 2) * this.radius * 0.0002 * signage[1]
	  ];
	
	  this.velocity = [
	    this.velocity[0] - drag[0],
	    this.velocity[1] - drag[1]
	  ];
	};
	
	// at canvas boundries
	MovingShape.prototype.ensureBounce = function (pos) {
	  const bounce = this.outOfBounds(pos) || { axis: null, negative: false };
	
	  if (bounce.axis === 'x') {
	    if (bounce.negative) { // moving left
	      if (this.velocity[0] < 0) { this.velocity[0] *= -0.95; }
	    } else {                         // moving right
	      if (this.velocity[0] > 0) { this.velocity[0] *= -0.95; }
	    }
	  } else if (bounce.axis === 'y') {
	    if (bounce.negative) { // moving up
	      if (this.velocity[1] < 0) { this.velocity[1] *= -0.95; }
	    } else {                         // moving down
	      if (this.velocity[1] > 0) { this.velocity[1] *= -0.95; }
	    }
	  }
	};
	
	MovingShape.prototype.outOfBounds = function (pos) {
	  if ((pos[0] - this.radius) <= 0) {
	    return { axis: 'x', negative: true };    // left
	  } else if ((pos[0] + this.radius) >= this.game.dimX) {
	    return { axis: 'x', negative: false };   // right
	
	  } else if ((pos[1] - this.radius) <= 0) {
	    return { axis: 'y', negative: true };    // top
	  } else if ((pos[1] + this.radius) >= this.game.dimY) {
	    return { axis: 'y', negative: false };  //bottom
	  }
	};
	
	module.exports = MovingShape;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Util = {
	  inherits (Child, Parent) {
	    function Surrogate(){}
	    Surrogate.constructor = Child;
	    Surrogate.prototype = Parent.prototype;
	    Child.prototype = new Surrogate();
	  }
	};
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map