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
	const Shape = __webpack_require__(8);
	const Util = __webpack_require__(5);
	
	const NUM_SHAPES = 40;
	
	function Game (dimX, dimY) {
	  this.dimX = dimX;
	  this.dimY = dimY;
	  this.shapes = [];
	
	  for (let i = 0; i < NUM_SHAPES; i++) {
	    this.addShape();
	  }
	
	  const playerPos = [(dimX / 2), (dimY / 2)];
	  this.player = new Player(playerPos, this);
	
	  this.allShapes = this.shapes.concat([this.player]);
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
	  //
	};
	
	Game.prototype.moveShapes = function () {
	  this.allShapes.forEach( shape => {
	    shape.move();
	  });
	};
	
	Game.prototype.addShape = function (pos, velocity, radius) {
	  if (!pos) {
	    pos = Util.randomPos(this.dimX, this.dimY);
	    this.shapes.push(new Shape(pos, this));
	  } else {
	    this.shape.push(new Shape(pos, this, radius, velocity));
	  }
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
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingShape = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Constants = __webpack_require__(7);
	
	const RADIUS = 16;
	const VELOCITY = [0, 0];
	
	const Player = function (pos, game) {
	  this.isPlayer = true;
	  this.color = Constants.COLORS.bright;
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

	// const Util = require('./util');
	
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
	
	  if (this.isPlayer) {
	    ctx.lineWidth = 6;
	    ctx.strokeStyle = this.color;
	    ctx.stroke();
	  } else {
	    ctx.fill();
	  }
	
	};
	
	MovingShape.prototype.move = function () {
	  this.ensureBounce(this.pos);
	  // if ((Math.abs(this.velocity[0]) < 1) &&
	  //     (Math.abs(this.velocity[1]) < 1 )) {
	  //       this.velocity = Util.randomVec();
	  //     }
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
	
	MovingShape.prototype.collidedWithPlayer = function () {
	  if (this.color === this.game.player.color) {
	    this.radius -= 1;
	
	    if (this.radius <= 1) {
	      this.game.removeShape(this);
	    }
	  }
	};
	
	MovingShape.prototype.isCollidedWith = function (other) {
	  const sumRadii = this.radius + other.radius;
	  const xDistance = Math.pow((this.pos[0] - other.pos[0]), 2);
	  const yDistance = Math.pow((this.pos[1] - other.pos[1]), 2);
	  const totDistance = Math.sqrt((xDistance + yDistance));
	
	  if (sumRadii > totDistance) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = MovingShape;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(7);
	
	const Util = {
	  inherits (Child, Parent) {
	    function Surrogate(){}
	    Surrogate.constructor = Child;
	    Surrogate.prototype = Parent.prototype;
	    Child.prototype = new Surrogate();
	  },
	
	  randomVec (max) {
	    let x = (Math.random() * max);
	    let y = Math.sqrt(Math.pow(max, 2) - Math.pow(x, 2));
	
	    if (Math.random() > 0.5) {
	      x *= -1;
	    }
	    if (Math.random() > 0.5) {
	      y *= -1;
	    }
	
	    return [x, y];
	  },
	
	  randomColor () {
	    const codes = Object.keys(Constants.COLORS);
	    const codeSample = codes[Math.floor(Math.random() * Object.keys(Constants.COLORS).length)];
	
	    return Constants.COLORS[codeSample];
	  },
	
	  randomPos (maxWidth, maxHeight) {
	    return [
	      Math.random() * maxWidth,
	      Math.random() * maxWidth
	    ];
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	const Constants = {
	  COLORS: {
	    bright: "#0cc9c7",
	    medium: "#369393",
	    dim: "#2e4852"
	  }
	};
	
	module.exports = Constants;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingShape = __webpack_require__(4);
	const Player = __webpack_require__(3);
	
	const Shape = function (pos, game, radius, velocity, color) {
	  if (!velocity) {
	    velocity = Util.randomVec(((Math.random() * 0.3) + 0.001));
	  }
	
	  radius = radius || (Math.random() * 10) + 10;
	
	  color = color || Util.randomColor();
	
	  MovingShape.call(this, pos, velocity, radius, color, game);
	};
	
	Util.inherits(Shape, MovingShape);
	
	module.exports = Shape;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map