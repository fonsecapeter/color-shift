const Util = require('./util');
const Constants = require('./constants');

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
  let velocityDiff = [], dispDiff = [];
  velocityDiff[0] = this.velocity[0] - other.velocity[1];
  velocityDiff[1] = this.velocity[1] - other.velocity[1];

  dispDiff[0] = this.pos[0] - other.pos[0];
  dispDiff[1] = this.pos[1] - other.pos[1];

  // if both cirlces moving towards each other (avoid sticking)
  if (Util.dotProduct(velocityDiff, dispDiff) < 0) {
    const thisMass = Math.pow(this.radius, 3);
    const otherMass = Math.pow(other.radius, 3);

    let newVelocity = [];
    newVelocity[0] =  (this.velocity[0] *
      (thisMass - otherMass) +
      (2 * otherMass * other.velocity[0])
    ) / (thisMass + otherMass);
    newVelocity[1] =  (this.velocity[1] *
      (thisMass - otherMass) +
      (2 * otherMass * other.velocity[1])
    ) / (thisMass + otherMass);

    let newOtherVelocity = [];
    newOtherVelocity[0] = (other.velocity[0] *
      (otherMass - thisMass) +
      (2 * thisMass * this.velocity[0])
    ) / (otherMass + thisMass);
    newOtherVelocity[1] = (other.velocity[1] *
      (otherMass - thisMass) +
      (2 * thisMass * this.velocity[1])
    ) / (otherMass + thisMass);

    this.velocity[0] = newVelocity[0] * 0.95;
    this.velocity[1] = newVelocity[1] * 0.95;
    other.velocity[0] = newOtherVelocity[0] * 0.95;
    other.velocity[1] = newOtherVelocity[1] * 0.95;
  }
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

  if (sumRadii >= totDistance) {
    if ((this.isPlayer && other.color !== this.color) || (!this.isPlayer && !other.isPlayer)) {
      this.bounceOther(other);
    }
    return true;
  } else {
    return false;
  }
};

module.exports = MovingShape;
