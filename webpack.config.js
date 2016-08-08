var path = require('path');
module.exports = {
  context: __dirname,
  entry: path.join(__dirname, 'lib', 'color_shift.js'),
  output: {
    path: path.join(__dirname),
    filename: "bundle.js"
  },
  module: {
    loaders: [
        {
        test: path.join(__dirname),
        loader: 'babel-loader',
        query: { presets: 'es2015' }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js"]
  }
};
