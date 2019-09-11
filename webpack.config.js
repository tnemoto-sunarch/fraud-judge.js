const path = require('path');

module.exports = {
  mode: "none",
  entry: ["./src/index.js"],
  output: {
    filename: "fraudjudge.js",
    path: path.join(__dirname, 'public/js')
  }
};