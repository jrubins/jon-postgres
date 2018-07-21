const DotenvPlugin = require('webpack-dotenv-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const buildConfig = require('./buildConfig')

module.exports = {
  context: __dirname,
  target: 'electron-renderer',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${buildConfig.serverPort}`,
    'webpack/hot/only-dev-server',
    buildConfig.paths.src.mainJs,
  ],
  output: {
    chunkFilename: 'js/[name].js',
    filename: 'js/[name].js',
    path: buildConfig.paths.dist,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [buildConfig.paths.src.base],
        loader: 'babel-loader',
        options: {
          cacheDirectory: buildConfig.paths.babelCache,
        },
      },
      {
        test: /\.scss$/,
        include: [buildConfig.paths.src.base],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // We don't really use this as different env files for different people. Just a place to keep common
    // env variables for the project as a whole.
    new DotenvPlugin({
      allowEmptyValues: true,
      path: '.env',
      sample: '.env',
    }),
    new HtmlWebpackPlugin({
      favicon: buildConfig.paths.src.favicon,
      template: buildConfig.paths.src.html,
    }),
    new webpack.HotModuleReplacementPlugin(),

    // Allows the HMR plugin to output more legible names.
    new webpack.NamedModulesPlugin(),

    // Ignore locales from moment.
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // Extracts common node modules from our async chunks.
    new webpack.optimize.CommonsChunkPlugin({
      async: 'node-async',
      children: true,
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1,
      names: ['main'],
    }),

    // This makes our vendor bundle from node_modules modules.
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1,
      name: 'vendor',
    }),

    // This ensures that our vendor bundle name doesn't change between builds (unless the vendor contents change)
    // by extracting out the webpack bootstrap code into its own file.
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      name: 'manifest',
    }),
  ],
  resolve: {
    modules: ['node_modules', buildConfig.paths.base],
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: buildConfig.serverPort,
  },
}
