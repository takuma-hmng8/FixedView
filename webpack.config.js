const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const ImageminMozjpeg = require('imagemin-mozjpeg');

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = "development";
// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: MODE,

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: "./src/index.js",
    // ファイルの出力設定
    output: {
        //  出力ファイルのディレクトリ名
        path: `${__dirname}/dist/assets/js`,
        // 出力ファイル名
        filename: "bundle.js",
    },
    //キャッシュ
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    },

    module: {
        rules: [
            // Sassファイルの読み込みとコンパイル
            {
                test: /\.scss/, // 対象となるファイルの拡張子
                use: [
                    // CSSファイルを書き出すオプションを有効にする
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    // CSSをバンドルするための機能
                    {
                        loader: "css-loader",
                        options: {
                            // オプションでCSS内のurl()メソッドの取り込みを禁止する
                            url: false,
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap,

                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                            importLoaders: 2
                        }
                    },
                    // PostCSSのための設定
                    {
                        loader: "postcss-loader",
                        options: {
                            // PostCSS側でもソースマップを有効にする
                            // sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                    // Autoprefixerを有効化
                                    // ベンダープレフィックスを自動付与する
                                    ["autoprefixer", {
                                        grid: true
                                    }],
                                ],
                            },
                        },
                    },
                    // Sassをバンドルするための機能
                    {
                        loader: "sass-loader",
                        options: {
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap
                        },
                    },
                ],
            },
            {
                // 対象となるファイルの拡張子
                test: /\.(gif|png|jpg|svg|webp)$/,
                // 閾値以上だったら埋め込まずファイルとして分離する
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        // 100KB以上だったら埋め込まずファイルとして分離する
                        maxSize: 100 * 1024,
                    },
                },
            },
        ],
    },
    plugins: [
        // CSSファイルを外だしにするプラグイン
        new MiniCssExtractPlugin({
            // ファイル名を設定します
            filename: "../css/style.css",
        }),
        //assetsの中身をコピーするプラグイン
        new CopyPlugin({
            patterns: [{
                from: "src/assets/images",
                to: "../images"
            }, ],
        }),
        //画像圧縮するプラグイン
        new ImageminPlugin({
            cacheFolder: 'dist/assets/images/cache',
            test: /\.(jpe?g|png|gif|svg)$/i,
            plugins: [
                ImageminMozjpeg({
                    quality: 85,
                    progressive: true,
                }),
            ],
            pngquant: {
                quality: '70-85',
            },
            gifsicle: {
                interlaced: false,
                optimizationLevel: 10,
                colors: 256,
            },
            svgo: {},
        }),
        //webp
        new ImageminWebpWebpackPlugin({
            config: [{
                cacheFolder: 'dist/assets/images/cache',
                test: /\.(png|jpe?g)$/i, // 対象ファイル
                options: {
                    quality: '70-85', // 画質
                }
            }]
        }),
    ],
    // ES5(IE11等)向けの指定
    target: ["web", "es5"],
};