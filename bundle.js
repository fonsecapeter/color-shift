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
	
	const startEl = document.getElementById('new');
	const canvasEl = document.getElementById("main");
	
	canvasEl.width = viewportSize.getWidth() - 5;
	canvasEl.height = viewportSize.getHeight() - 4;
	
	const ctx = canvasEl.getContext('2d');
	
	window.playing = false;
	document.addEventListener("keydown", () => {
	  if (!window.playing) {
	    startEl.className += " hidden";
	
	    window.playing = true;
	    const gameView = new GameView(canvasEl.width, canvasEl.height).start(ctx);
	  }
	});


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
	
	  if (this.game.isOver() === false ) {
	    requestAnimationFrame(this.cycle.bind(this, ctx));
	  }
	};
	
	GameView.prototype.isGameOver = function () {
	  return false;
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(3);
	const Shape = __webpack_require__(7);
	const Util = __webpack_require__(5);
	const Constants = __webpack_require__(6);
	
	const NUM_SHAPES = 60;
	
	function Game (dimX, dimY) {
	  this.dimX = dimX;
	  this.dimY = dimY;
	  this.shapes = {
	    bright: [],
	    medium: [],
	    dim: []
	  };
	
	  for (let i = 0; i < NUM_SHAPES; i++) {
	    this.addShape();
	  }
	
	  const playerPos = [(dimX / 2), (dimY / 2)];
	  this.player = new Player(playerPos, this);
	  this.shapes.player = [this.player];
	}
	
	Game.prototype.step = function () {
	  this.isOver();
	  this.moveShapes();
	  this.checkCollisions();
	};
	
	Game.prototype.render = function (ctx) {
	  ctx.clearRect(0, 0, this.dimX, this.dimY);
	
	  this.forEachShape ( shape => {
	    shape.render(ctx);
	  });
	
	  this.player.render(ctx);
	};
	
	Game.prototype.checkCollisions = function () {
	  this.forEachShape ( shape => {
	    if (shape.isCollidedWith(this.player)) {
	      shape.collidedWithPlayer();
	    }
	
	    this.forEachShape ( otherShape => {
	      if (otherShape !== this) {
	        shape.isCollidedWith(otherShape);
	      }
	    });
	  });
	};
	
	Game.prototype.moveShapes = function () {
	  this.forEachShape(shape => {
	    shape.move();
	  });
	
	  this.player.move();
	};
	
	Game.prototype.addShape = function (pos, velocity, radius) {
	  let shape;
	  if (!pos) {
	    pos = Util.randomPos(this.dimX, this.dimY);
	    shape = new Shape(pos, this);
	  } else {
	    shape = new Shape(pos, this, radius, velocity);
	  }
	
	  const clrCode = Object.keys(Constants.COLORS).filter( key => Constants.COLORS[key] === shape.color)[0];
	
	  this.shapes[clrCode].push(shape);
	};
	
	Game.prototype.removeShape = function (shape) {
	  const clrCode = Object.keys(Constants.COLORS).filter( key => Constants.COLORS[key] === shape.color)[0];
	
	  const idx = this.shapes[clrCode].indexOf(shape);
	  if (idx > -1) {
	    this.shapes[clrCode].splice(idx, 1);
	  }
	};
	
	Game.prototype.isOver = function () {
	  // Object.keys(this.shapes).forEach ( color => {
	  for (let i = 0; i < Object.keys(this.shapes).length; i ++) {
	    const color = Object.keys(this.shapes)[i];
	    if (this.shapes[color].length > 0 && color !== "player") {
	      return false;
	    }
	  }
	  return true;
	};
	
	Game.prototype.invalidColors = function () {
	  let colors = {};
	  Object.keys(Constants.COLORS).forEach( color => {
	    colors[Constants.COLORS[color]] = 0;
	  });
	
	  this.forEachShape ( shape => {
	    if (!shape.isPlayer) {
	      colors[shape.color] += 1;
	    }
	  });
	
	  let emptyColors = [];
	  Object.keys(colors).forEach( color => {
	    if (colors[color] < 1) {
	      emptyColors.push(color);
	    }
	  });
	
	  if (emptyColors.length < Object.keys(Constants.COLORS).length - 1) {
	    emptyColors.push(this.player.color);
	  }
	
	  return emptyColors;
	};
	
	Game.prototype.forEachShape = function (callback) {
	  Object.keys(this.shapes).forEach( color => {
	    this.shapes[color].forEach ( shape => {
	      callback(shape);
	    });
	  });
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingShape = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Constants = __webpack_require__(6);
	
	const RADIUS = 10;
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
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const Constants = __webpack_require__(6);
	
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
	    ctx.lineWidth = Constants.PLAYER_STROKE;
	    ctx.strokeStyle = this.color;
	    ctx.stroke();
	  } else {
	    ctx.fill();
	  }
	
	};
	
	MovingShape.prototype.move = function () {
	  this.ensureBounce(this.pos);
	
	  if (this.isPlayer) {
	    this.windResit(this.velocity);
	  }
	
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
	
	MovingShape.prototype.bounceOther = function (other) {
	  this.velocity[0] =  (this.velocity[0] * (this.radius - other.radius) + (other.radius * other.velocity[0])) / (2 * (this.radius + other.radius));
	  this.velocity[1] = (this.velocity[1] * (this.radius - other.radius) + (other.radius * other.velocity[1])) / (2 * (this.radius + other.radius));
	  // other.velocity[0] = (other.velocity[0] * (other.radius - this.radius) + (2 * this.radius * this.velocity[0])) / (2 * (other.radius + this.radius));
	  // other.velocity[1] = (other.velocity[1] * (other.radius - this.radius) + (2 * this.radius * this.velocity[1])) / (2 * (other.radius + this.radius));
	};
	
	// at canvas boundries
	MovingShape.prototype.ensureBounce = function (pos) {
	  const bounce = this.outOfBounds(pos) || { axis: null, negative: false };
	
	  let damping = -1;
	  if (this.isPlayer) {
	    damping = -0.9;
	  }
	
	  if (bounce.axis === 'x') {
	    if (bounce.negative) { // moving left
	      if (this.velocity[0] < 0) { this.velocity[0] *= damping; }
	    } else {                         // moving right
	      if (this.velocity[0] > 0) { this.velocity[0] *= damping; }
	    }
	  } else if (bounce.axis === 'y') {
	    if (bounce.negative) { // moving up
	      if (this.velocity[1] < 0) { this.velocity[1] *= damping; }
	    } else {                         // moving down
	      if (this.velocity[1] > 0) { this.velocity[1] *= damping; }
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
	  if (this.color === this.game.player.color && !this.isPlayer) {
	    this.radius -= 1;
	
	    if (this.radius <= 1) {
	      this.game.removeShape(this);
	
	      let invalidColors = this.game.invalidColors();
	      (invalidColors.length >= Object.keys(Constants.COLORS).length) ? invalidColors = [] : invalidColors = invalidColors;
	      this.game.player.color = Util.randomColor(invalidColors);
	    }
	  }
	};
	
	MovingShape.prototype.isCollidedWith = function (other) {
	  const sumRadii = this.radius + other.radius;
	  const xDistance = Math.pow((this.pos[0] - other.pos[0]), 2);
	  const yDistance = Math.pow((this.pos[1] - other.pos[1]), 2);
	  const totDistance = Math.sqrt((xDistance + yDistance));
	
	  const self = this;
	  if (sumRadii > totDistance) {
	    if (other.color !== this.color) {
	      self.bounceOther(other);
	    }
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = MovingShape;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(6);
	
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
	
	  randomColor (invalidColors) {
	
	    const codes = Object.keys(Constants.COLORS);
	    const codeSample = codes[Math.floor(Math.random() * Object.keys(Constants.COLORS).length)];
	
	    const sampledColor = Constants.COLORS[codeSample];
	    if (invalidColors && invalidColors.indexOf(sampledColor) !== -1) {
	      return Util.randomColor(invalidColors);
	    } else {
	      return sampledColor;
	    }
	  },
	
	  randomPos (maxWidth, maxHeight) {
	    return [
	      Math.floor((Math.random() * (maxWidth - Constants.MAX_RADIUS + 1)) + Constants.MAX_RADIUS),
	      Math.floor((Math.random() * (maxHeight - Constants.MAX_RADIUS + 1)) + Constants.MAX_RADIUS)
	    ];
	  },
	
	  randomRadius () {
	    return Math.floor((Math.random() * (Constants.MAX_RADIUS - 6 + 1)) + 6);
	  }
	};
	
	module.exports = Util;
	
	window.maxWidth = viewportSize.getWidth() - 5;
	window.maxHeight = viewportSize.getHeight() - 4;
	window.Constants = Constants;


/***/ },
/* 6 */
/***/ function(module, exports) {

	const Constants = {
	  COLORS: {
	    bright: "#0cc9c7",
	    medium: "#369393",
	    dim: "#2e4852"
	  },
	
	  PLAYER_STROKE: 6,
	  MAX_RADIUS: 40
	};
	
	module.exports = Constants;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingShape = __webpack_require__(4);
	const Player = __webpack_require__(3);
	
	const Shape = function (pos, game, radius, velocity, color) {
	  if (!velocity) {
	    velocity = Util.randomVec(((Math.random() * 0.3) + 0.001));
	  }
	
	  radius = radius || Util.randomRadius();
	
	  color = color || Util.randomColor();
	
	  MovingShape.call(this, pos, velocity, radius, color, game);
	};
	
	Util.inherits(Shape, MovingShape);
	
	module.exports = Shape;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map