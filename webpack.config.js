/* eslint-disable no-undef */

const path = require("path");

module.exports = (env, argv) => ({
  mode: argv.mode ?? "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Pixi expects people to be using Browserify. We're not, but we still can use
      // its brfs module to deal with pixi code using "fs".
      {
        include: path.resolve(__dirname, "node_modules/pixi.js"),
        use: "transform?brfs",
      },
    ],
  },
  externals: [
    // Don't bundle pixi.js, assume it'll be included in the HTML via a script
    // tag, and made available in the global variable PIXI.
    {"pixi.js": "PIXI"}
  ],
});
