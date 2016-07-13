const Constants = require('./constants');

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
