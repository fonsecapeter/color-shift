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
