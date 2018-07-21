const path = require('path')

module.exports = {
  serverPort: 9999,
  paths: {
    babelCache: path.resolve(__dirname, '.babel-cache'),
    base: path.resolve(__dirname, '.'),
    dist: path.resolve(__dirname, 'dist'),
    src: {
      base: path.resolve(__dirname, 'src'),
      favicon: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
      html: path.resolve(__dirname, 'src/views/index.html'),
      mainJs: path.resolve(__dirname, 'src/main.jsx'),
    },
  },
}
