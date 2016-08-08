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
	const endEl = document.getElementById('end');
	const canvasEl = document.getElementById("main");
	const clockEl = document.getElementById("clock");
	const endTimeEl = document.getElementById("end-time");
	
	canvasEl.width = viewportSize.getWidth() - 5;
	canvasEl.height = viewportSize.getHeight() - 4;
	
	const ctx = canvasEl.getContext('2d');
	
	function startGame () {
	  clockEl.className = "clock";
	  clockEl.innerHTML = "";
	  endEl.className = "toplevel-wrapper hidden";
	  startEl.className += " hidden";
	
	  window.playing = true;
	  const gameView = new GameView(canvasEl.width, canvasEl.height, clockEl, endEl, endTimeEl).start(ctx);
	}
	
	window.playing = false;
	document.addEventListener("keydown", () => {
	  if (!window.playing && event.keyCode === 32) {
	    startGame();
	  }
	
	});
	
	// start without prompt on iphone
	var standalone = window.navigator.standalone,
	    userAgent = window.navigator.userAgent.toLowerCase(),
	    safari = /safari/.test( userAgent ),
	    ios = /iphone|ipod|ipad/.test( userAgent );
	
	if (ios) {
	  alert("mobile safari detected");
	  startGame();
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const Player = __webpack_require__(3);
	
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
	  'right': [ 0.2, 0],
	
	  'up+left':    [-0.2, -0.2],
	  'up+right':   [ 0.2, -0.2],
	  'down+left':  [-0.2,  0.2],
	  'down+right': [ 0.2,  0.2]
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
	  this.clockEl.className = "clock hidden";
	  window.playing = false;
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(3);
	const Shape = __webpack_require__(7);
	const Util = __webpack_require__(5);
	const Constants = __webpack_require__(6);
	
	const NUM_SHAPES = 30;
	
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
	  this.player = new Player(playerPos, this, this.invalidColors());
	  this.shapes.player = [this.player];
	}
	
	Game.prototype.step = function () {
	  this.isOver();
	  this.checkCollisions();
	  this.moveShapes();
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
	    shape.alreadyCollided = [];
	  });
	  
	  this.forEachShape ( shape => {
	    if (shape.isCollidedWith(this.player) && shape !== this.player) {
	      shape.collidedWithPlayer();
	    }
	
	    this.forEachShape ( otherShape => {
	      if (otherShape !== shape) {
	        shape.isCollidedWith(otherShape);
	      }
	    });
	  });
	};
	
	Game.prototype.moveShapes = function () {
	  this.forEachShape(shape => {
	    shape.adjustForces();
	  });
	
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
	
	  if (emptyColors.length < Object.keys(Constants.COLORS).length - 1 && this.player) {
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
	
	const Player = function (pos, game, invalidColors) {
	  this.isPlayer = true;
	  this.color = Util.randomColor(invalidColors);
	  MovingShape.call(this, pos, VELOCITY, RADIUS, this.color, game);
	};
	
	Util.inherits(Player, MovingShape);
	
	Player.prototype.thrust = function (impulse) {
	  this.impulse[0] += impulse[0];
	  this.impulse[1] += impulse[1];
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
	
	  this.mass = Math.pow(this.radius, 3);
	  this.reflectiveForce = [0, 0];
	  this.alreadyCollided = [];
	  this.impulse = [0, 0];
	  this.boundingForce = [1, 1];
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
	
	  // if (this.isPlayer) {
	    this.windResit(this.velocity);
	  // }
	
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
	
	MovingShape.prototype.adjustForces = function () {
	  if (this.reflectiveForce[0] === 0) {
	    this.reflectiveForce[0] = this.velocity[0];
	  }
	  if (this.reflectiveForce[1] === 0) {
	    this.reflectiveForce[1] = this.velocity[1];
	  }
	  this.velocity[0] = (this.reflectiveForce[0] + this.impulse[0]) * this.boundingForce[0];
	  this.velocity[1] = (this.reflectiveForce[1] + this.impulse[1]) * this.boundingForce[1];
	
	  this.reflectiveForce = [0, 0];
	  this.impulse = [0, 0];
	  this.boundingForce = [1, 1];
	};
	
	MovingShape.prototype.bounceOther = function (other) {
	  if (this.alreadyCollided.indexOf(other) === -1 &&
	      other.alreadyCollided.indexOf(this) === -1) {
	
	    const inelasticLoss = 0.9;
	    let velocityDiff = [], dispDiff = [];
	    velocityDiff[0] = this.velocity[0] - other.velocity[1];
	    velocityDiff[1] = this.velocity[1] - other.velocity[1];
	
	    dispDiff[0] = this.pos[0] - other.pos[0];
	    dispDiff[1] = this.pos[1] - other.pos[1];
	
	    // if both cirlces moving towards each other (avoid sticking)
	    if (Util.dotProduct(velocityDiff, dispDiff) < 0) {
	      this.alreadyCollided.push(other);
	      other.alreadyCollided.push(this);
	
	      let newReflectiveForce = [];
	      newReflectiveForce[0] = ( this.velocity[0] *
	        (this.mass - other.mass) +
	        (2 * other.mass * other.velocity[0])
	      ) / (this.mass + other.mass);
	      newReflectiveForce[1] = ( this.velocity[1] *
	        (this.mass - other.mass) +
	        (2 * other.mass * other.velocity[1])
	      ) / (this.mass + other.mass);
	
	      let newOtherReflectiveForce = [];
	      newOtherReflectiveForce[0] = ( other.velocity[0] *
	        (other.mass - this.mass) +
	        (2 * this.mass * this.velocity[0])
	      ) / (other.mass + this.mass);
	      newOtherReflectiveForce[1] = ( other.velocity[1] *
	        (other.mass - this.mass) +
	        (2 * this.mass * this.velocity[1])
	      ) / (other.mass + this.mass);
	
	      this.reflectiveForce[0] += (newReflectiveForce[0]) * inelasticLoss;
	      this.reflectiveForce[1] += (newReflectiveForce[1]) * inelasticLoss;
	      other.reflectiveForce[0] += (newOtherReflectiveForce[0]) * inelasticLoss;
	      other.reflectiveForce[1] += (newOtherReflectiveForce[1]) * inelasticLoss;
	  }
	    // stuck horizontally
	  } if (Math.abs(this.velocity[0]) + Math.abs(other.velocity[0]) < 0.2) {
	    let right, left;
	    if (this.pos[0] < other.pos[0]) {
	      left = this;
	      right = other;
	    } else {
	      left = other;
	      right = this;
	    }
	
	    // nudge apart
	    left.reflectiveForce[0] += -0.1;
	    right.reflectiveForce[0] += 0.1;
	
	    // stuck vertically
	  } else if (Math.abs(this.velocity[1]) + Math.abs(other.velocity[1]) < 0.2) {
	    let bottom, top;
	    if (this.pos[1] < other.pos[1]) {
	      top = this;
	      bottom = other;
	    } else {
	      top = other;
	      bottom = this;
	    }
	
	    // nudge apart
	    top.reflectiveForce[1] += -0.1;
	    bottom.reflectiveForce[1] += 0.1;
	  }
	};
	
	// at canvas boundries
	MovingShape.prototype.ensureBounce = function (pos) {
	  const bounce = this.outOfBounds(pos) || { axis: null, negative: false };
	
	  let reflection = -1;
	  let nudge = [0, 0];
	
	
	  if (bounce.x) {
	    if (bounce.xnegative) { // moving left
	      if (this.velocity[0] < 0) { this.boundingForce[0] = reflection; }
	      else if (this.velocity[0] > -0.2 && this.velocity[0] < 0) { nudge[0] = 0.2; }
	    } else {               // moving right
	      if (this.velocity[0] > 0) { this.boundingForce[0] = reflection; }
	      else if (this.velocity[0] < 0.2 && this.velocity[0] > 0) { nudge[0] = -0.2; }
	    }
	  } else if (bounce.y) {
	    if (bounce.ynegative) { // moving up
	      if (this.velocity[1] < 0) { this.boundingForce[1] = reflection; }
	      else if (this.velocity[1] > -0.2 && this.velocity[1] < 0) { nudge[1] = 0.2; }
	    } else {              // moving down
	      if (this.velocity[1] > 0) { this.boundingForce[1] = reflection; }
	      else if (this.velocity[1] < 0.2 && this.velocity[1] > 0) { nudge[1] = -0.2; }
	    }
	  }
	  if (this === this.game.player && nudge[1] !== 0) { console.log(this.reflectiveForce[1], nudge[1], this.boundingForce[1]); }
	
	  this.reflectiveForce[0] += nudge[0];
	  this.reflectiveForce[1] += nudge[1];
	};
	
	MovingShape.prototype.outOfBounds = function (pos) {
	  let output = {};
	
	  if ((pos[0] - this.radius) <= 0) {
	    output.x = true;    // left
	    output.xnegative = true;
	  } else if ((pos[0] + this.radius) >= this.game.dimX) {
	    output.x = true;    // right
	    output.xnegative= false;
	
	  } else if ((pos[1] - this.radius) <= 0) {
	    output.y = true;   //top
	    output.ynegative= true;
	  } else if ((pos[1] + this.radius) >= this.game.dimY) {
	    output.y = true;   //bottom
	    output.ynegative = false;
	  }
	
	  return output;
	};
	
	MovingShape.prototype.collidedWithPlayer = function () {
	  if (this.color === this.game.player.color && !this.isPlayer) {
	    // shrink the circle
	    this.radius -= 1;
	    this.mass = Math.pow(this.radius, 3);
	
	    // also pull the circle toward the center of the player
	    let pullx;
	    if (this.game.player.pos[0] < this.pos[0]) {
	      pullx = -0.7;
	    } else{
	      pullx = 0.7;
	    }
	
	    let pully;
	    if (this.game.player.pos[1] < this.pos[1]) {
	      pully = -0.7;
	    } else{
	      pully = 0.7;
	    }
	
	    this.reflectiveForce[0] += pullx;
	    this.reflectiveForce[1] += pully;
	
	    if (this.radius <= 1) {
	      this.game.removeShape(this);
	
	      // only pick from colors represented in game
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
	
	  if (sumRadii >= totDistance) {
	    // don't bounce if collision is between player and shape of same color
	    if ((this.isPlayer && other.color !== this.color) || (!this.isPlayer && !other.isPlayer)) {
	      this.bounceOther(other);
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
	  },
	
	  dotProduct (arr1, arr2) {
	    // assumes arr1.length === arr2.length
	    let dotProd = 0;
	    for (let i = 0; i < arr1.length; i++) {
	      dotProd += (arr1[i] * arr2[i]);
	    }
	    return dotProd;
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
	    medium: "#308282",
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
	    velocity = Util.randomVec(((Math.random() * 0.6) + 0.001));
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