const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const configCommon = require('./webpack.config.common');

const buildScriptDir = configCommon.buildScriptDir === '' ? '' : `${configCommon.buildScriptDir}/`;
const buildCSSDir = configCommon.buildCSSDir === '' ? '' : `${configCommon.buildCSSDir}/`;  

const exportObject = {
    cache: true,
    watch: configCommon.useWatch,
    watchOptions: {
        aggregateTimeout: 1000,
        ignored: /node_modules/
    },
    entry: path.join(configCommon.absoluteSourcePath, configCommon.entryJs),
    output: {
        path: configCommon.absoluteBuildPath,
        filename: `${buildScriptDir}${configCommon.bundleName}.js`
    },
    plugins: [

        new ExtractTextPlugin(`${buildCSSDir}${configCommon.bundleName}.css`),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpack.DefinePlugin({
            '__DEV__': false,
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],
    module: {
        rules: configCommon.allLoaders(ExtractTextPlugin)
    },
    resolve: configCommon.resolveEntry,
    resolveLoader: configCommon.resolveLoaderEntry
};

if (configCommon.useDllLibraryForProduction) {
  
    exportObject.plugins.push(
        new webpack.DllReferencePlugin({
            context: configCommon.absoluteBuildScriptsPath,
            manifest: require(path.join(configCommon.absoluteBuildScriptsPath, `${configCommon.dllBundleName}.json`))
         })
    );
    exportObject.plugins.push(
        new HtmlWebpackPlugin({
            filename: path.join(configCommon.absoluteBuildPath, configCommon.htmlOutputFileName),
            template: path.join(configCommon.absoluteBuildPath, configCommon.htmlTemplate),
            inject: 'body', 
            hash: true
        })
    );
} else {
    exportObject.plugins.push(
        new HtmlWebpackPlugin({
            filename: path.join(configCommon.absoluteBuildPath, configCommon.htmlOutputFileName),
            template: path.join(configCommon.absoluteDevToolsPath, configCommon.htmlTemplate),
            inject: 'body',
            hash: true
        })       
    );
}  

module.exports = exportObject;

