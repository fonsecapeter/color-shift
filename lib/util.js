const Util = {
  inherits (Child, Parent) {
    function Surrogate(){}
    Surrogate.constructor = Child;
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();
  }
};

module.exports = Util;
