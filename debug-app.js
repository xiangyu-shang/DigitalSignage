/**
 * @file debug-app.js
 * @description 纯英文调试版本启动脚本，用于排查问题的本质
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// 使用调试版本的App.vue
function useDebugVersion() {
  log('=== Setting up debug version ===', colors.bright + colors.green);
  
  const debugAppPath = path.join(__dirname, 'src', 'renderer', 'App.vue.debug');
  const targetAppPath = path.join(__dirname, 'src', 'renderer', 'App.vue');
  
  if (fs.existsSync(debugAppPath)) {
    try {
      // Backup original file
      if (fs.existsSync(targetAppPath)) {
        const backupPath = `${targetAppPath}.original`;
        fs.copyFileSync(targetAppPath, backupPath);
        log(`Original App.vue backed up to: ${backupPath}`, colors.green);
      }
      
      // Copy debug version
      fs.copyFileSync(debugAppPath, targetAppPath);
      log('Debug version of App.vue applied successfully', colors.green);
    } catch (error) {
      log(`Error replacing App.vue: ${error.message}`, colors.red);
    }
  } else {
    log('Debug version of App.vue not found', colors.yellow);
  }
}

// 使用调试版本的main.js
function useDebugMainJs() {
  log('=== Setting up debug main.js ===', colors.bright + colors.green);
  
  const debugMainPath = path.join(__dirname, 'src', 'renderer', 'main.debug.js');
  const targetMainPath = path.join(__dirname, 'src', 'renderer', 'main.js');
  
  if (fs.existsSync(debugMainPath)) {
    try {
      // Backup original file
      if (fs.existsSync(targetMainPath)) {
        const backupPath = `${targetMainPath}.original`;
        fs.copyFileSync(targetMainPath, backupPath);
        log(`Original main.js backed up to: ${backupPath}`, colors.green);
      }
      
      // Copy debug version
      fs.copyFileSync(debugMainPath, targetMainPath);
      log('Debug version of main.js applied successfully', colors.green);
    } catch (error) {
      log(`Error replacing main.js: ${error.message}`, colors.red);
    }
  } else {
    log('Debug version of main.js not found', colors.yellow);
  }
}

// Fix import error in main.js - Check if vue import is using .js extension
function fixMainJsImport() {
  log('=== Checking main.js imports ===', colors.bright + colors.green);
  
  const mainJsPath = path.join(__dirname, 'src', 'renderer', 'main.js');
  
  if (fs.existsSync(mainJsPath)) {
    try {
      let content = fs.readFileSync(mainJsPath, 'utf8');
      let modified = false;
      
      // Check for common import issues
      if (content.includes("from 'vue'")) {
        log('Vue import looks OK', colors.green);
      }
      
      if (content.includes("from './App'")) {
        content = content.replace("from './App'", "from './App.vue'");
        modified = true;
        log('Fixed App import by adding .vue extension', colors.yellow);
      }
      
      if (content.includes("from './App.vue'")) {
        log('App.vue import looks OK', colors.green);
      } else if (!content.includes("from './App")) {
        log('Could not find App import statement, might need manual check', colors.red);
      }
      
      if (modified) {
        fs.writeFileSync(mainJsPath, content, 'utf8');
        log('main.js updated with fixes', colors.green);
      }
    } catch (error) {
      log(`Error checking main.js: ${error.message}`, colors.red);
    }
  } else {
    log('main.js not found, please check file structure', colors.red);
  }
}

// Create a simplified development environment config
function createSimpleWebpackConfig() {
  log('=== Creating simplified Webpack config ===', colors.bright + colors.green);
  
  const configPath = path.join(__dirname, 'webpack.debug.config.js');
  const content = `
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    app: path.join(__dirname, 'src/renderer/main.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\\.(png|jpe?g|gif|svg)$/i,
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
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/renderer/index.html'),
      filename: 'index.html',
      title: '数字标牌系统 - 调试模式',
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, 'src/renderer'),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    host: '127.0.0.1',
    port: 8080,
    hot: true,
  },
};
  `.trim();
  
  try {
    fs.writeFileSync(configPath, content, 'utf8');
    log(`Simplified Webpack config created at: ${configPath}`, colors.green);
  } catch (error) {
    log(`Error creating simplified Webpack config: ${error.message}`, colors.red);
  }
}

// Start app in development mode
function startDevServer() {
  log('=== Starting development server ===', colors.bright + colors.blue);
  
  try {
    // First try to install all dependencies
    log('Running NPM install...', colors.cyan);
    execSync('npm install', { stdio: 'inherit' });
    
    // Start Webpack with simplified config
    log('Starting Webpack development server...', colors.cyan);
    const webpack = spawn('npx', ['webpack', 'serve', '--config', 'webpack.debug.config.js'], {
      stdio: 'inherit',
      shell: true,
      env: { 
        ...process.env,
        WEBPACK_DEBUG: 'true',
        LANG: 'en_US.UTF-8',
        LC_ALL: 'en_US.UTF-8',
        CHCP: '65001'
      }
    });
    
    // Log any errors
    webpack.on('error', (error) => {
      log(`Webpack server error: ${error.message}`, colors.red);
    });
    
    // Wait a bit for Webpack to start
    setTimeout(() => {
      log('Starting Electron...', colors.cyan);
      const electron = spawn('npx', ['electron', '.'], {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
          NODE_ENV: 'development',
          LANG: 'en_US.UTF-8',
          LC_ALL: 'en_US.UTF-8',
          CHCP: '65001'
        }
      });
      
      electron.on('error', (error) => {
        log(`Electron error: ${error.message}`, colors.red);
      });
    }, 5000);
  } catch (error) {
    log(`Error starting development server: ${error.message}`, colors.red);
  }
}

// Main function
function main() {
  log('===== Starting Webpack+Electron Debug Mode =====', colors.bright + colors.magenta);
  
  // Execute debug steps
  useDebugVersion();
  useDebugMainJs();
  fixMainJsImport();
  createSimpleWebpackConfig();
  startDevServer();
}

// Run the main function
main(); 