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
