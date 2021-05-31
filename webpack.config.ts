import * as webpack from 'webpack';
import * as path from 'path'
const CopyPlugin = require('copy-webpack-plugin');
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
        new CopyPlugin({
            patterns: [
                { context: './src/', from : '**/*.json', to : './' },
                { context: './src/', from : '**/*.html', to : './' },
                { context: './', from : 'README.md', to : './' },
                { context: './', from : 'LICENSE', to : './' },
                { context: './docs', from : 'Configuration.md', to : './docs' },
                { context: './docs', from : 'Macros.md', to : './docs' },
                { context: './docs', from : 'Notes.md', to : './docs' },
                { context: './docs', from : 'UpdatingDateTime.md', to : './docs' },
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
                    {
                        loader: 'css-loader',
                        options: {
                            url: (url: string, resourcePath: string) => {return url.indexOf('/systems') !== 0; }
                        }
                    },
                    // Compiles Sass to CSS
                    'sass-loader'
                ],
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
};

export default config;
