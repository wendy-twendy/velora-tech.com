const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/js/app.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        // Add specific handling for Spline files
        {
          test: /\.(glb|gltf)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: {
        // Add fallbacks for Node.js core modules that Spline might try to use
        "fs": false,
        "path": false,
        "crypto": false,
        "stream": false,
        "buffer": false,
      }
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/' 
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: !isDevelopment,
              drop_debugger: !isDevelopment
            }
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(), 
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
        // Add this to help with Spline's environment detection
        'process.env.IS_SPLINE': 'true',
        'global': 'window',
      }),
      new webpack.ProgressPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      }),
      // Add ProvidePlugin to automatically load modules that Spline might need
      new webpack.ProvidePlugin({
        process: 'process',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    devtool: isDevelopment ? 'inline-source-map' : false
  };
};
