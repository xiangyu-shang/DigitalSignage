const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  entry: {
    app: path.join(__dirname, 'src/renderer/main.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: isDevelopment ? '/' : './',
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      // Vue文件处理
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      // JavaScript文件处理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // CSS文件处理
      {
        test: /\.css$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      // 图片文件处理
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // 字体文件处理
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // 音频文件处理
      {
        test: /\.(mp3|wav|ogg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/audio/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/renderer/index.html'),
      filename: 'index.html',
      title: '数字标牌系统',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, 'src/renderer'),
    },
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/'
      }
    ],
    compress: true,
    host: '127.0.0.1',
    port: 8080,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
}; 