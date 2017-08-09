const path = require('path');
const webpack = require('webpack');
const configCommon = require('./webpack.config.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildScriptDir = configCommon.buildScriptDir === '' ? '' : `${configCommon.buildScriptDir}/`;

module.exports = {
  entry: {
    dllModules: configCommon.dllModules
  },

  output: {
    filename: `${buildScriptDir}${configCommon.dllBundleName}.js`,
    path: configCommon.absoluteBuildPath,
    library: configCommon.dllBundleName
  },

  plugins: [
    new webpack.DefinePlugin({
        '__DEV__': false,
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.DllPlugin({
      context: configCommon.absoluteBuildScriptsPath,
      name: configCommon.dllBundleName,
      path: path.join(configCommon.absoluteBuildScriptsPath, `${configCommon.dllBundleName}.json`)
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        },
        output: {
            comments: false
        }
    }),
    new HtmlWebpackPlugin({
      template: path.join(configCommon.absoluteDevToolsPath, configCommon.htmlTemplate),
      filename: path.join(configCommon.absoluteBuildPath, configCommon.htmlTemplate),
      inject: 'body', 
      hash: true
    })
  ],
  resolve: configCommon.resolveEntry,
  resolveLoader: configCommon.resolveLoaderEntry
};


