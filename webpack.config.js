const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    watch: !isProduction,
    entry: ['./src/index.js', './src/sass/style.scss'],
    output: {
      path: path.join(__dirname, './dist'),
      filename: '[contenthash].js',
    },

    plugins: [
      isProduction ? new CleanWebpackPlugin() : () => {},
      new HtmlWebpackPlugin({
        favicon: './src/assets/img/favicon.ico',
        template: path.resolve(__dirname, './index.html'),
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules',
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        {
          test: /\.(png|svg|jpe?g|gif|mp3)$/i,
          use: [{ loader: 'file-loader' }],
        },
        {
          test: /\.mp3$/,
          include: '/src',
          loader: 'file-loader',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {},
            },
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
  };
  return config;
};
