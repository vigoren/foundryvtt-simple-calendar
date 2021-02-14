import * as webpack from 'webpack';
import * as path from 'path'
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const config: webpack.Configuration = {
    mode: "production",
    entry: {
        "index": './src/index.ts',
        "styles/calendar": './src/styles/index.scss'
    },
    optimization: {
        removeEmptyChunks: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { context: './src/', from : '**/*.json', to : './' },
                { context: './src/', from : '**/*.html', to : './' },
                { context: './', from : 'README.md', to : './' },
                { context: './', from : 'LICENSE', to : './' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    'sass-loader'
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
};

export default config;
