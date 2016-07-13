var path = require('path');
module.exports = {
  context: __dirname,
  entry: path.join(__dirname, 'lib', 'shape_shift.js'),
  output: {
    path: path.join(__dirname),
    filename: "bundle.js"
  },
  module: {
    loaders: [],
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js"]
  }
};
