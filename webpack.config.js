/**
 * @file webpack.config.js
 * @description 网页应用Webpack配置，用于将Electron应用转换为纯网页应用
 */

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 加载应用配置
const appConfig = require('./web-app-config');

// 环境变量
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  entry: {
    app: path.join(__dirname, 'src/renderer/main.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
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
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
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
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192, // 8kb以下内联为base64
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      // 字体文件处理
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
      // 音频文件处理
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name].[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    // 清理dist目录
    new CleanWebpackPlugin(),
    
    // Vue加载器插件
    new VueLoaderPlugin(),
    
    // HTML生成插件
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/renderer/index.html'),
      filename: 'index.html',
      title: appConfig.display.defaultTitle || '咖啡及饮品商品展示系统',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        description: appConfig.appInfo.description,
      },
      minify: !isDevelopment,
    }),
    
    // CSS提取插件
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
    }),
    
    // 复制静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          to: path.join(__dirname, 'dist'),
          globOptions: {
            ignore: ['**/icon.ico', '**/icon.icns'],
          },
        },
        // 复制数据文件（如果有）
        {
          from: path.join(__dirname, 'data'),
          to: path.join(__dirname, 'dist/data'),
          noErrorOnMissing: true,
        },
      ],
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
    host: appConfig.server.host || '127.0.0.1',
    port: appConfig.server.port || 8080,
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
    minimize: !isDevelopment,
  },
}; 