const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Set up environment variables.
const result = dotenv.config();

// Prevent other keys from leaking into the app by defining allowed keys.
const allowedKeys = [
  'INTERCOM_APP_ID',
  'SENTRY_PUBLIC_DSN',
  'SEGMENT_WRITE_KEY',
  'DEBUG',
  'BASE_URL',
  'SOCKET_BASE',
  'SENTRY_DSN'
];

const env = result.error ? process.env : result.parsed;
const envKeys = Object.keys(env).reduce((acc, next) => {
  if (allowedKeys.includes(next)) {
    acc[`process.env.${next}`] = JSON.stringify(env[next]);
  }
  return acc;
}, {});

module.exports = {
  output: {
    publicPath: '/',
    chunkFilename: '[chunkhash].js'
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /favicon\.ico$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      style: path.resolve(__dirname, 'src/sass/'),
      pages: path.resolve(__dirname, 'src/components/pages/'),
      components: path.resolve(__dirname, 'src/components/'),
      models: path.resolve(__dirname, 'src/models/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      lib: path.resolve(__dirname, 'src/lib/'),
      images: path.resolve(__dirname, 'src/images/')
    }
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin(envKeys),
    new CopyWebpackPlugin(['./_redirects', './favicon.ico']),
    // TODO: Can be removed once Froala releases jQuery-less version.
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
