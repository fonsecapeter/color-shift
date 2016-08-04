const Util = require('./util');
const Constants = require('./constants');

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

      //const this.mass = Math.pow(this.radius, 3);
      //const other.mass = Math.pow(other.radius, 3);

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

  if (this === this.game.player) {
    console.log(bounce);
  }

  if (bounce.x) {
    if (bounce.xnegative) { // moving left
      if (this.velocity[0] < 0) { this.boundingForce[0] = reflection; }
      if (this.velocity[0] > -0.2) { nudge[0] = 0.2; }
    } else {               // moving right
      if (this.velocity[0] > 0) { this.boundingForce[0] = reflection; }
      if (this.velocity[0] < 0.2) { nudge[0] = -0.2; }
    }
  } else if (bounce.y) {
    if (bounce.ynegative) { // moving up
      if (this.velocity[1] < 0) { this.boundingForce[1] = reflection; }
      if (this.velocity[1] > -0.2) { nudge[1] = 0.2; }
    } else {              // moving down
      if (this.velocity[1] > 0) { this.boundingForce[1] = reflection; }
      if (this.velocity[1] < 0.2) { nudge[1] = -0.2; }
    }
  }

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
