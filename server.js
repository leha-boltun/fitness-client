var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

const server = process.argv[process.argv.length - 1]

console.log("using server " + server)

config.module.rules.push(
    {
      test: /host\.ts$/,
      loader: 'string-replace-loader',
      options: {
        search: /^.+$/,
        replace: 'export default "' + server +'";',
      }
    }
)

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true
}).listen(3000, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }
});
