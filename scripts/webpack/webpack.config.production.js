const webpack = require('webpack');
const config = require('./webpack.config');

const _ = {
  cloneDeep: require('lodash.clonedeep')
};

config.plugins = config.plugins || [];

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}));

const minConfig = _.cloneDeep(config);

minConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
  beautify: false,
  comments: false,
  sourceMap: true,
  compress: {
    drop_console: true,
    collapse_vars: true,
    reduce_vars: true,
    drop_debugger: true,
    warnings: false
  }
}));

minConfig.output.filename = 'index.min.js';

module.exports = [config, minConfig];
