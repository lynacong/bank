var path = require('path')
var webpack = require('webpack')

// 将vue里面的css提取成一个单独的css文件的插件, 用法见插件官网及vue-loader里面关于提取css的介绍
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: process.env.NODE_ENV === 'production' ? '/df/fap/messageplatform/chat/dist/' : 'http://localhost:8080/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            // 'scss': 'vue-style-loader!css-loader!postcss-loader!sass-loader',
            // 'sass': 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax',
            'css': ExtractTextPlugin.extract({
              use: 'css-loader!postcss-loader',
            }),
            'scss': ExtractTextPlugin.extract({
              use: 'css-loader!postcss-loader!sass-loader',
            }),
            'sass': ExtractTextPlugin.extract({
              use: 'css-loader!postcss-loader!sass-loader?indentedSyntax',
            }),

          },
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|woff|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: '/df/fap/messageplatform/chat/dist/',
          limit: 8192,
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader!postcss-loader"
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader!postcss-loader!sass-loader"
        })
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new ExtractTextPlugin("style.css")
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
