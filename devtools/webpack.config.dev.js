const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const configCommon = require('./webpack.config.common');

module.exports = {
    cache: true,
    devtool: 'eval-source-map',
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${process.env.npm_package_config_host}:${process.env.npm_package_config_port}`,
        'webpack/hot/only-dev-server',
        path.join(configCommon.absoluteSourcePath, configCommon.entryJs) // js filename for the program entry point.
    ],
    output: {
        path: configCommon.absoluteBuildPath,
        filename: `${path.join(configCommon.buildScriptDir, configCommon.bundleName)}.js`        
    },
    plugins: [
        new webpack.DefinePlugin({
            '__DEV__': true,
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DllReferencePlugin({
            context:configCommon.absoluteDllPath, 
            manifest: require(path.join(configCommon.absoluteDllPath, `${configCommon.dllBundleName}.json`))
        }),
        new HtmlWebpackPlugin({
            template: configCommon.htmlDevTemplate, 
            inject: 'body' 
        })
    ],

    module: {
        rules: configCommon.allLoaders(null)
    },
    resolve: configCommon.resolveEntry,
    resolveLoader: configCommon.resolveLoaderEntry
};
