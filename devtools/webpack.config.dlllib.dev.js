const path = require('path');
const webpack = require('webpack');
const configCommon = require('./webpack.config.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
  entry: {
    dllModules:configCommon.dllModules
  }, 
 
  output: { 
    filename: `${configCommon.dllBundleName}.js`, 
    path: configCommon.absoluteDllPath, 
    library: configCommon.dllBundleName 
  },
  
  plugins: [ 
    new webpack.DllPlugin({ 
      context: configCommon.absoluteDllPath,
      name: configCommon.dllBundleName, 
      path: path.join(configCommon.absoluteDllPath, `${configCommon.dllBundleName}.json`)
    }),
    new HtmlWebpackPlugin({
      template: path.join(configCommon.absoluteDevToolsPath, configCommon.htmlTemplate),
      filename: path.join(configCommon.basePath, configCommon.htmlDevTemplate), 
      inject: 'body',
      hash: true
    })  
  ],
    resolve: configCommon.resolveEntry,
    resolveLoader: configCommon.resolveLoaderEntry
};





