// eslint-disable-next-line
const autoprefixer = require('autoprefixer');
// eslint-disable-next-line
const webpack = require('webpack');
const path = require('path');
// eslint-disable-next-line
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line
const WebpackMd5Hash = require('webpack-md5-hash');
// eslint-disable-next-line
const CleanWebpackPlugin = require('clean-webpack-plugin');
// eslint-disable-next-line
const CopyWebpackPlugin = require('copy-webpack-plugin');


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src', 'index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['vendor', 'main'],
});
module.exports = {
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  devtool: 'eval',
  entry: {
    vendor: [
      'babel-polyfill',
      'normalizr',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-form',
      'redux-thunk',
      'reselect',
    ],
    main: path.join(__dirname, 'src', 'index.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js',
  },
  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.(ico|json)$/,
      loader: 'file-loader?name=[name].[ext]',
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000',
    }, {
      test: /\.(eot|ttf|wav|mp3)$/,
      loader: 'file-loader',
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module&-autoprefixer', 'postcss'],
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module&-autoprefixer', 'postcss', 'sass'],
    }],
  },
  postcss: () =>
    [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
      }),
    ],
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'data', to: 'data' },
    ]),
    new WebpackMd5Hash(),
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ],
  devServer: {
    inline: true,
    port: 8080,
  },
};
