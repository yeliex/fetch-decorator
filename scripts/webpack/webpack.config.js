const webpack = require('webpack');

const babelOptions = {
  'presets': [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0')
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports')
  ]
};

module.exports = {
  entry: './src/index.js',
  output: {
    path: require('path').join(__dirname, '../../', '/dist'),
    library: 'WXS',
    libraryTarget: 'umd',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: babelOptions
        }]
      }
    ]
  },
  devtool: '#source-map',
  target: 'web',
  plugins: []
};
