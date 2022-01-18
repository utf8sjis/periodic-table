const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/static/js/main.js',
  output: {
    path: `${__dirname}/dist/static/js`,
    filename: 'main.min.js',
  },
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'app/static/js/check_browser.js',
          to: 'check_browser.js',
        },
      ],
    }),
  ],
};
