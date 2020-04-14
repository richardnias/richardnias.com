const fs = require("fs");
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    host: "richardnias.local",
    https: {
      key: fs.readFileSync("ssl/richardnias.local-key.pem"),
      cert: fs.readFileSync("ssl/richardnias.local.pem"),
    },
  },
});
