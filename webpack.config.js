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
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      chunkFilename: 'chunks/[name].[contenthash].js', 
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
      splitChunks: {
        chunks: 'async', 
        minSize: 20000,
        maxSize: 100000, 
        automaticNameDelimiter: '-',
        cacheGroups: {
          reactVendors: {
            test: /[\\/]node_modules[\\/](react|react-dom)/,
            name: 'react-vendors',
            chunks: 'async',
            priority: 20
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'async',
            priority: 10
          },
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: false 
    },
    plugins: [
      new CleanWebpackPlugin(), 
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production')
      }),
      new webpack.ProgressPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      }),
      new webpack.BannerPlugin({
        banner: `
        (function() {
          window.addEventListener('error', function(event) {
            if (event.message && (event.message.includes('Loading chunk') || event.message.includes('ChunkLoadError'))) {
              console.error('Chunk loading error caught by global handler:', event.message);
              event.preventDefault();
              return true;
            }
          });
          
          var originalJsonpFunction = window["webpackJsonp"];
          if (originalJsonpFunction) {
            window["webpackJsonp"] = function() {
              try {
                return originalJsonpFunction.apply(null, arguments);
              } catch (e) {
                console.error("Chunk jsonp error caught:", e);
                return [];
              }
            };
          }
        })();
        `,
        raw: true,
        entryOnly: true
      })
    ],
    devtool: isDevelopment ? 'inline-source-map' : false
  };
};
