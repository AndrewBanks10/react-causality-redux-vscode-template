const path = require('path');
const autoprefixer = require('autoprefixer');
const config = require('./webpack.config.config');

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

const resolveEntry = {
  modules: [
    config.absoluteSourcePath,
    config.node_modulesPath
  ],
  extensions: config.resolveExtensions
};

const resolveLoaderEntry = {
  modules: [
    config.node_modulesPath
  ]
};

config.allLoaders = allLoaders;
config.resolveEntry = resolveEntry;
config.resolveLoaderEntry = resolveLoaderEntry;
module.exports = config;

function cssLoaders(sourceMaps, useModules) {
  return {
    style: {
      loader: 'style-loader'
    },
    css: {
      loader: 'css-loader',
      options: {
        sourceMaps,
        modules: useModules,
        localIdentName: '[name]__[local]___[hash:base64:5]'
      }
    },
    postcss: {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          autoprefixer({
            browsers: ['last 2 versions']
          })
        ]
      }
    },
    sass: {
      loader: 'sass-loader',
      options: {
        sourceMaps,
        includePaths: [config.absoluteSourcePath]
      }
    },
    less: {
      loader: 'less-loader',
      options: {
        sourceMaps,
        includePaths: [config.absoluteSourcePath]
      }
    }
  };
}
 
function cssLoader(ExtractTextPlugin, isInline, cssType, sourceMaps, useModules) {
  const loaders = cssLoaders(sourceMaps, useModules);
  let loadersUse = [loaders.css, loaders.postcss];
  const loaderObj = {};

  if ( useModules )
    loaderObj.exclude = new RegExp(`node_modules|${config.noCSSModulesName}`);
  else
    loaderObj.include = new RegExp(config.noCSSModulesName);
  
  if ( isInline )
    loadersUse = [loaders.style, loaders.css, loaders.postcss];
  
  if (cssType === 'less')
    loadersUse.push(loaders.less);
  else if (cssType === 'sass') 
    loadersUse.push(loaders.sass);
  
  if (!isProduction()) {
    if (cssType === 'less') {
      loaderObj.test = /\.less$/;
    } else if (cssType === 'sass') {
      loaderObj.test = /\.sass$|\.scss$/;
    } else
      loaderObj.test = /\.css$/;
  } else if (isInline) {
    if (cssType === 'less') {
      loaderObj.test = /\.inject\.less$/;
    } else if (cssType === 'sass') {
      loaderObj.test = /\.inject\.sass$|\.inject\.scss$/;
    } else {
      loaderObj.test = /\.inject\.css$/;
    } 
  } else {
    if (cssType === 'less') {
      loaderObj.test = /^((?!\.inject).)*\.less$/;
    } else if (cssType === 'sass') {
      loaderObj.test = /^((?!\.inject).)*\.sass$|^((?!\.inject).)*\.scss$/;
    } else {
      loaderObj.test = /^((?!\.inject).)*\.css$/;
    }
  } 

  if (!isInline)
    loaderObj.use = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      publicPath: '../',
      use: loadersUse
    });
  else
    loaderObj.use = loadersUse;
 
  return loaderObj;
}
   
function allLoaders(ExtractTextPlugin) {
  // Default loader for .js and .jsx files
  const loaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules|bower_components/,
      use: ['babel-loader']
    }
  ];

  // Url loader
  if ( config.urlLoaderExtensions.length > 0) {
    let regexString = '(';
    config.urlLoaderExtensions.forEach( (e,index) => {
      if ( index + 1 === config.urlLoaderExtensions.length)
        regexString += e;
      else
        regexString += `${e}|`;
    });
    regexString += ')$';

    loaders.push( {
      test: new RegExp(regexString),
      loader: 'url-loader',
      options: {
        name: path.join(config.assetsDirectory, '[name].[ext]'),
        limit: config.urlLoaderLimit
      },
      include: path.join(config.absoluteSourcePath, config.assetsDirectory)
    });
  }

  if (!isProduction()) {
    config.stylesheetTypes.forEach(cssType => {
      if (config.useCSSModules === 0) {
        loaders.push(cssLoader(ExtractTextPlugin, true, cssType, true, false));
      } else if (config.useCSSModules === 1) {
        loaders.push(cssLoader(ExtractTextPlugin, true, cssType, true, true));
      } else if (config.useCSSModules === 2) {
        loaders.push(cssLoader(ExtractTextPlugin, true, cssType, true, false));
        loaders.push(cssLoader(ExtractTextPlugin, true, cssType, true, true));
      }
    });
  } else {
    const useProductionInjection = (cssType) =>
      config.useLessInjections && cssType === 'less' || config.useSassInjections && cssType === 'sass' || config.useCssInjections && cssType === 'css';

    config.stylesheetTypes.forEach(cssType => {
      if (config.useCSSModules === 0) {
        loaders.push(cssLoader(ExtractTextPlugin, false, cssType, false, false));
      } else if (config.useCSSModules === 1) {
        loaders.push(cssLoader(ExtractTextPlugin, false, cssType, false, true));
        if (useProductionInjection(cssType))
          loaders.push(cssLoader(ExtractTextPlugin, true, cssType, false, true));
      } else if (config.useCSSModules === 2) {
        loaders.push(cssLoader(ExtractTextPlugin, false, cssType, false, false));
        loaders.push(cssLoader(ExtractTextPlugin, false, cssType, false, true));
        if (useProductionInjection(cssType))
          loaders.push(cssLoader(ExtractTextPlugin, true, cssType, false, true));
      }
    });
  } 
  
  return loaders;
}

