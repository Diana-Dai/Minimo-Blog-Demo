const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: "./src/js/custom.js",
  output: {
    filename: "index.[contenthash:10].js",
    path: resolve(__dirname, "build"),
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    // separate code from node_modules directory
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: { workers: 2 },
          },
          {
            loader: "babel-loader",
            options: {
              // 预设：指示babel做怎么样的兼容性处理
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // 按需加载
                    useBuiltIns: "usage",
                    // 指定core-js版本
                    corejs: {
                      version: 3,
                    },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17",
                    },
                  },
                ],
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      minify: false,
    }),
    // copy images
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/imgs",
          to: "imgs",
        },
      ],
    }),
    // compress images
    new ImageminPlugin({
      pngquant: {
        quality: "95-100",
      },
      plugins: [imageminMozjpeg({ quality: 60 })],
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: "css/main.[contenthash:10].css",
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new CompressionWebpackPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html)$/,
      // 只处理大于xx字节 的文件，默认：0
      // threshold: 10240,
      // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
      minRatio: 0.8, // 默认: 0.8
    }),
  ],
  mode: "production",
  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    port: 3000,
    open: true,
  },
  cache: {
    type: "memory",
  },
};
